/**
 * Description: Sockets types and interfaces
 */

import { Socket } from 'socket.io';

import { TokenPayload } from 'utils/authentication';
import { GameSubscriber } from 'utils/socket/components';
import { Users } from 'db/entities';

export interface ExtendedSocket extends Socket {
  user: Users;
}

export type GamePayload = {
  gameName: string;
  status: number;
  gameRating: number;
  gamers: GameSubscriber[];
};

export type NewGamerRatingsPayload = {
  id: string;
  rating: string;
};
