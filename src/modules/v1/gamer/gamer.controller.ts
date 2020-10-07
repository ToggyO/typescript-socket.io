/**
 * Description: Gamer module controller for handling gamer routing
 */

import { Response, NextFunction } from 'express';

import { ExtendedRequest } from 'declaration';
import { Users } from 'db/entities';
import { getSuccessRes } from 'utils/response';
import { getProp } from 'utils/helpers';
import { AuthData } from 'modules/interfaces';

import { GamerService } from './gamer.service';
import { CreateGamerPayload, GetUserParams } from './types';

export class GamerController {
  /**
   * Get gamer
   */
  public static async getGamer(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = getProp<GetUserParams, Record<string, any>>(req, 'params', {});

      const resultData = await GamerService.getGamer({ where: { id } });

      res.status(200).send(
        getSuccessRes<Users>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get profile of current authorized gamer
   */
  public static async getProfile(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = getProp<GetUserParams, Record<string, any>>(req, 'userData', {});

      const resultData = await GamerService.getGamer({ where: { id } });

      res.status(200).send(
        getSuccessRes<Users>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login as gamer or create gamer
   */
  public static async loginOrCreateGamer(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = getProp<CreateGamerPayload, Record<string, any>>(req, 'body', {});

      const resultData = await GamerService.loginOrCreateGamer(body);

      res.status(200).send(
        getSuccessRes<AuthData>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
