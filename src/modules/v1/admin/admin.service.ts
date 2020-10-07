/**
 * Description: Admin module service
 */

import { UpdateResult } from 'typeorm';

import { Users } from 'db/entities';
import { Roles } from 'db/entities/Users';
import { BaseService } from 'modules/common';
import { AuthData } from 'modules/interfaces';
import { ERROR_CODES } from 'constants/error-codes';
import { ApplicationError } from 'utils/response';
import { generateToken } from 'utils/authentication';
import { setGamersRating } from 'utils/helpers';

import { AdminLoginPayload, RecalculateRatingPayload } from './types';

export class AdminService extends BaseService {
  /**
   * Login as admin
   */
  public static async loginAsAdmin(values: AdminLoginPayload): Promise<AuthData> {
    const driedValues = AdminService.dryPayload<AdminLoginPayload, Record<string, (arg: string) => string>>(
      values,
      AdminService.loginAsAdminPayloadSchema(),
    );

    const admin = await Users.findOne({
      where: {
        name: driedValues.name,
        password: driedValues.password,
      },
    });

    if (!admin) {
      throw new ApplicationError({
        statusCode: 400,
        errorMessage: 'User doesnt exist or credentials is wrong',
        errorCode: ERROR_CODES.authorization__invalid_credentials_error,
        errors: [],
      });
    }

    const tokenPayload = generateToken({
      userId: admin.id,
      name: admin.name,
      role: admin.role,
      rating: admin.rating,
    });

    return {
      id: admin.id,
      name: admin.name,
      role: admin.role,
      token: tokenPayload,
    };
  }

  /**
   * Set value of rating column of all gamers in database to 1
   */
  public static async resetRating(): Promise<UpdateResult> {
    return Users.update({ role: Roles.Gamer }, { rating: '1.0' });
  }

  /**
   * Update the rating column for a set of players from an array by id
   */
  public static async recalculateRating(gamers: Array<RecalculateRatingPayload>): Promise<Array<Users>> {
    const parsedGamers = gamers.map((gamer) => ({
      id: parseInt(gamer.id, 10),
      rank: isNaN(parseInt(gamer.rank, 10)) ? 3 : parseInt(gamer.rank, 10),
    }));
    const users = await Users.findByIds(parsedGamers, { where: { role: Roles.Gamer } });

    const data = users.map((user) => {
      parsedGamers.forEach((gamer) => {
        if (gamer.id === user.id) {
          const newRating = parseFloat(user.rating) + setGamersRating(gamer.rank);
          user.rating = newRating < 1 ? '1' : newRating > 3 ? '3' : `${newRating}`;
        }
      });
      return user;
    });

    return Users.save(data);
  }

  /**
   * Data transformation schema for creation and editing
   */
  private static loginAsAdminPayloadSchema(): Record<string, (arg: string) => string> {
    return {
      name: (value: string): string => value,
      password: (value: string): string => value,
    };
  }
}
