/**
 * Description: Class describing the schema of the game subscriber model
 */

import { Roles } from 'db/entities/Users';

export class GameSubscriber {
  public id: number;

  public name: string;

  public role: Roles.Gamer | Roles.Admin;

  public rating: number;
}
