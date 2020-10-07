/**
 * Description: Application root request errors handler
 */

import * as express from 'express';

import { IApplicationError, IService } from 'interfaces';
import { ERROR_CODES } from 'constants/error-codes';

export class ErrorHandler implements IService {
  public app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  public run(): void {
    this.app.use(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (
        err: IApplicationError,
        req: express.Response,
        res: express.Response,
        next: express.NextFunction,
      ): void => {
        if (!err.errorCode) {
          this.app.get('log').error(err);
        }

        if (err.statusCode && err.errorMessage) {
          const { statusCode, errorCode, errorMessage, errors = [] } = err;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          res.status(statusCode).send({
            errorCode,
            errorMessage,
            errors,
          });
          return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        res.status(err.statusCode || ERROR_CODES.internal_server_error).send({
          errorCode: err.errorCode || ERROR_CODES.internal_server_error,
          errorMessage:
            err.errorCode && err.errorCode !== ERROR_CODES.internal_server_error
              ? err.errorMessage
              : `Internal server error: ${err.errorMessage || err.message}`,
          errors: err.errors || [],
        });
      },
    );
  }
}
