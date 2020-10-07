/**
 * Description: Gamer module service
 */

import { FindOneOptions } from 'typeorm';

import { Users } from 'db/entities';
import { BaseService } from 'modules/common';
import { AuthData } from 'modules/interfaces';
import { generateToken } from 'utils/authentication';

import { GamerValidator } from './gamer.validator';
import { CreateGamerPayload } from './types';
import { Roles } from 'db/entities/Users';

export class GamerService extends BaseService {
  /**
   * Get gamer
   */
  public static async getGamer(conditions: FindOneOptions): Promise<Users | undefined> {
    return Users.findOne(conditions);
  }

  /**
   * Login as gamer or create gamer
   */
  public static async loginOrCreateGamer(values: CreateGamerPayload): Promise<AuthData> {
    const driedValues = GamerService.dryPayload<CreateGamerPayload, Record<string, (arg: string) => string>>(
      values,
      GamerService.createPayloadSchema(),
    );

    let gamer = await Users.findOne({
      where: {
        name: driedValues.name,
        password: driedValues.password,
      },
    });

    if (!gamer) {
      await GamerValidator.createUserValidator(driedValues);

      const newGamer = GamerService.setEntityProperties<Users>(new Users(), driedValues);
      newGamer.role = Roles.Gamer;

      gamer = await newGamer.save();
    }

    const parsedRating = parseFloat(gamer.rating);
    const tokenPayload = generateToken({
      userId: gamer.id,
      name: gamer.name,
      role: gamer.role,
      rating: gamer.rating,
    });

    return {
      id: gamer.id,
      name: gamer.name,
      role: gamer.role,
      rating: parsedRating,
      token: tokenPayload,
    };
  }

  /**
   * Data transformation schema for creation and editing
   */
  private static createPayloadSchema(): Record<string, (arg: string) => string> {
    return {
      name: (value: string): string => value,
      password: (value: string): string => value,
    };
  }
}
