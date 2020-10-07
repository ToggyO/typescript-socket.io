/**
 * Description: Class describing the schema of the game model
 */

import { GameStatus } from 'constants/game-statuses';

import { GameSubscriber } from './GameSubscriber';

export class Game {
  public gameId: string;

  public gameName: string;

  public gameRating: number;

  public status: GameStatus.Waiting | GameStatus.Ready | GameStatus.Progress | GameStatus.Finished;

  public subscribers: GameSubscriber[] = [];
}
