/**
 * Description: Base web-server configuration settings.
 */

import * as express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { IService } from 'interfaces';

export class ServerSettings implements IService {
  public app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  public run(): void {
    // Request data parsing
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '1mb' }));
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // Unhandled errors handler
    this.unhandledRejection(this.app);
  }

  private unhandledRejection(app: express.Application): void {
    const log = app.get('log');
    const unhandledRejections: any[] = [];

    process.on('unhandledRejection', (reason: { [key: string]: any }, promise) => {
      const errorMsgContent = `${reason?.stack || reason}`;
      const errorMsg = errorMsgContent.replace(/(\r\n|\n|\r)|(\s{2,})/gm, ' ');
      log.warn(errorMsg);
      unhandledRejections.push(promise); // or Promise.reject(new Error())
    });

    process.on('rejectionHandled', (promise) => {
      const index = unhandledRejections.indexOf(promise);
      unhandledRejections.splice(index, 1);
    });
  }
}
