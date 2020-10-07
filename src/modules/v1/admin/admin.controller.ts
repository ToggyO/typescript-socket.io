/**
 * Description: Admin module controller for handling admin routing
 */

import { Response, NextFunction } from 'express';

import { ExtendedRequest } from 'declaration';
import { getSuccessRes } from 'utils/response';
import { getProp } from 'utils/helpers';
import { AuthData } from 'modules/interfaces';

import { AdminService } from './admin.service';
import { AdminLoginPayload, RecalculateRatingPayload } from './types';

export class AdminController {
  /**
   * Login as admin
   */
  public static async loginAsAdmin(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<AdminLoginPayload, Record<string, any>>(req, 'body', {});

      const resultData = await AdminService.loginAsAdmin(body);

      res.status(200).send(
        getSuccessRes<AuthData>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset gamers rating
   */
  public static async resetRating(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AdminService.resetRating();

      res.status(200).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recalculate gamers rating
   */
  public static async recalculateRating(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = getProp<RecalculateRatingPayload[], []>(req, 'body.gamers', []);

      const resultData = await AdminService.recalculateRating(body);

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }
}
