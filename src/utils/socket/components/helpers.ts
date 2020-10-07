/**
 * Description: lass describing helpers for working with socket
 */

import { Game } from 'utils/socket/components';

import { GamePayload } from '../types';

export class SocketHelpers {
  /**
   * Generate game name
   */
  public static generateGameName(): string {
    return `Игра №${Math.round(Math.random() * 10000)}`;
  }

  /**
   * Generate game info for gamer
   */
  public static generateGamePayload(game: Game): GamePayload | null {
    if (!game) {
      return null;
    }
    return {
      gameName: game.gameName,
      status: game.status,
      gameRating: game.gameRating,
      gamers: game.subscribers,
    };
  }
}
