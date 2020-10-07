/**
 * Description: Class describing socket connection
 */

import { Server } from 'http';
import socketIo from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import config from 'config';
import { Roles, Users } from 'db/entities/Users';
import { ApplicationError } from 'utils/response';
import { checkToken, unauthorizedErrorPayload } from 'utils/authentication/authenticate';
import { SOCKET } from 'constants/socket-events';
import { GameStatus } from 'constants/game-statuses';
import { TokenPayload } from 'utils/authentication';

import { Game, GameSubscriber, SocketHelpers } from './components';
import { ExtendedSocket, NewGamerRatingsPayload } from './types';

export const games: Game[] = [];

export class SocketConnector {
  public readonly server: Server;
  protected io: socketIo.Server;
  protected MAX_GAMERS_COUNT = 5;
  protected adminRoomId = '12345-67890';

  constructor(server: Server, options: socketIo.ServerOptions = {}) {
    this.server = server;
    this.io = socketIo(server, options);

    this.onAuth = this.onAuth.bind(this);
    this.onConnection = this.onConnection.bind(this);
    this.handleEvents = this.handleEvents.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
    this.addGamer = this.addGamer.bind(this);
    this.removeGamer = this.removeGamer.bind(this);
    this.updateGameStatus = this.updateGameStatus.bind(this);

    this.io.use(this.onAuth);
    this.io.use(this.onConnection);
    this.io.on(SOCKET.CONNECTION, this.handleEvents);
  }

  protected async onAuth(
    socket: socketIo.Socket,
    next: (err?: any) => any,
  ): Promise<socketIo.Namespace | undefined> {
    const { handshake } = socket;
    const { query = {} } = handshake;

    const { AUTHORIZATION_HEADER } = config;

    if (!query[AUTHORIZATION_HEADER].length) {
      setTimeout(() => socket.disconnect(true), 5000);
      next(new ApplicationError(unauthorizedErrorPayload));
    }

    const accessToken = (
      query[AUTHORIZATION_HEADER] ||
      query[AUTHORIZATION_HEADER.toLowerCase()] ||
      ''
    ).replace('Bearer ', '');

    try {
      const user = (await checkToken(accessToken)) as TokenPayload;
      const userData = await Users.findOne(user.userId);

      if (!userData) {
        return next(new ApplicationError(unauthorizedErrorPayload));
      }

      (socket as ExtendedSocket).user = userData;
    } catch (error) {
      setTimeout(() => socket.disconnect(true), 5000);
      console.log('token is invalid');
      return next(error);
    }

    return next();
  }

  protected onConnection(socket: socketIo.Socket, next: (err?: any) => any): Promise<socketIo.Namespace> {
    const typedSocket = socket as ExtendedSocket;
    if (!typedSocket.user) {
      next(new ApplicationError(unauthorizedErrorPayload));
    }

    console.log(`User ${typedSocket.user.name} is connected`);

    return next();
  }

  protected handleEvents(socket: ExtendedSocket): void {
    const { user } = socket;

    const subscriber = new GameSubscriber();
    subscriber.id = user.id;
    subscriber.name = user.name;
    subscriber.role = user.role;
    subscriber.rating = parseFloat(user.rating);

    if (user.role === Roles.Admin) {
      this.handleAdminEvents(socket, subscriber);
    } else {
      this.handleGamerEvents(socket, subscriber);
    }
  }

  protected handleAdminEvents(socket: ExtendedSocket, subscriber: GameSubscriber): void {
    const { adminRoomId, io } = this;

    socket.join(adminRoomId);

    socket.on(SOCKET.JOIN, () => {
      socket.emit(SOCKET.SYSTEM_MESSAGE, { games, admin: subscriber });
    });

    socket.on(SOCKET.GET_GAME, (gameId: string) => {
      const game = games.find((game: Game) => game.gameId === gameId);
      socket.emit(SOCKET.SET_GAME_ADMIN, game);
    });

    socket.on(SOCKET.START_GAME, (gameId: string) => {
      const changedGame = this.updateGameStatus(gameId, GameStatus.Progress);
      io.to(gameId).emit(SOCKET.ENTER_GAME, changedGame);
      io.to(adminRoomId).emit(SOCKET.ENTER_GAME, changedGame);
      io.to(adminRoomId).emit(SOCKET.SYSTEM_MESSAGE, { games });
    });

    socket.on(SOCKET.END_GAME, (gameId: string, newGamerRatings: NewGamerRatingsPayload[], callback) => {
      const changedGame = this.updateGameStatus(gameId, GameStatus.Finished);

      if (Array.isArray(newGamerRatings)) {
        const parsedGamerRatings = newGamerRatings.map((gamer: NewGamerRatingsPayload) => ({
          id: parseInt(gamer.id, 10),
          rating: isNaN(parseFloat(gamer.rating)) ? 1 : parseFloat(gamer.rating),
        }));

        if (changedGame) {
          changedGame.subscribers.forEach((gamer: GameSubscriber) => {
            parsedGamerRatings.forEach((payload) => {
              if (gamer.id === payload.id) {
                gamer.rating = payload.rating;
              }
            });
          });
        }
      }

      io.to(gameId).emit(SOCKET.END_GAME_REDIRECT, changedGame);
      io.to(adminRoomId).emit(SOCKET.END_GAME_REDIRECT, changedGame);
      io.to(adminRoomId).emit(SOCKET.SYSTEM_MESSAGE, { games });
      if (callback) {
        callback();
      }
    });

    socket.on(SOCKET.DISCONNECT, () => {
      console.log('Admin is disconnected!');
    });
  }

  protected handleGamerEvents(socket: ExtendedSocket, subscriber: GameSubscriber): void {
    const { MAX_GAMERS_COUNT: maxCount, adminRoomId, io } = this;

    let game: Game | undefined = games.find(
      (game: Game) =>
        game.subscribers.length < maxCount &&
        game.gameRating <= subscriber.rating &&
        subscriber.rating < game.gameRating + 1,
    );

    if (game) {
      game = this.addGamer(game, subscriber);
    } else {
      game = this.createNewGame(subscriber);
    }

    io.to(game!.gameId).emit(SOCKET.SYSTEM_MESSAGE, SocketHelpers.generateGamePayload(game!));

    socket.on(SOCKET.JOIN, () => {
      socket.join(game!.gameId);
      socket.emit(SOCKET.SYSTEM_MESSAGE, SocketHelpers.generateGamePayload(game!));
      io.to(adminRoomId).emit(SOCKET.SYSTEM_MESSAGE, { games });
      io.to(adminRoomId).emit(SOCKET.SET_GAME_ADMIN, game);
    });

    socket.on(SOCKET.DISCONNECT, () => {
      const newGameData = this.removeGamer(game!, subscriber);
      io.to(game!.gameId).emit(SOCKET.SYSTEM_MESSAGE, SocketHelpers.generateGamePayload(newGameData!));
      io.to(adminRoomId).emit(SOCKET.SYSTEM_MESSAGE, { games });
      io.to(adminRoomId).emit(SOCKET.SET_GAME_ADMIN, newGameData);
      console.log('Gamer is disconnected!');
    });
  }

  protected createNewGame(subscriber: GameSubscriber): Game {
    const newGame = new Game();
    newGame.gameId = uuidv4();
    newGame.gameName = SocketHelpers.generateGameName();
    newGame.gameRating = Math.floor(subscriber.rating);
    newGame.status = GameStatus.Waiting;
    newGame.subscribers.push(subscriber);
    games.push(newGame);
    return newGame;
  }

  protected addGamer(game: Game, gamer: GameSubscriber): Game | undefined {
    const isInGame = game.subscribers.find((sub) => sub.id === gamer.id);
    if (isInGame) {
      return;
    }
    game.subscribers.push(gamer);
    return this.updateGameStatus(game.gameId);
  }

  protected removeGamer(game: Game, gamer: GameSubscriber): Game | undefined {
    const gamerIndex = game.subscribers.findIndex((sub) => sub.id === gamer.id);
    if (gamerIndex < 0) {
      return;
    }
    game.subscribers.splice(gamerIndex, 1);
    if (game.subscribers.length < 1) {
      const gameIndex = games.findIndex((g: Game) => g.gameId === game.gameId);
      if (~gameIndex) {
        games.splice(gameIndex, 1);
      }
    }
    return this.updateGameStatus(game.gameId);
  }

  protected updateGameStatus(gameId: string, status?: GameStatus): Game | undefined {
    const { MAX_GAMERS_COUNT: maxCount } = this;
    const changedGame = games.find((game: Game) => game.gameId === gameId);

    if (changedGame && status) {
      changedGame.status = status;
    } else {
      if (changedGame && changedGame.subscribers.length === maxCount) {
        changedGame.status = GameStatus.Ready;
      }

      if (changedGame && changedGame.subscribers.length < maxCount) {
        changedGame.status = GameStatus.Waiting;
      }
    }

    return changedGame;
  }
}
