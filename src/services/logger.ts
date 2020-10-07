/**
 * Description: Application logger initialization.
 * Logger can be launched in development mode(logging to console) and production mode(logging to file).
 */

import * as express from 'express';

import { IService } from 'interfaces';
import { Logger, ProdLogger, LocalDevLogger, LoggerProps } from 'utils/logger';

export class CreateLogger implements IService {
  public app: express.Application;
  public logger: Logger | null = null;
  public readonly options: LoggerProps;

  constructor(app: express.Application, options: LoggerProps) {
    this.app = app;
    this.options = options;
  }

  public run(): void {
    const { mode } = this.options;
    if (mode === 'production') {
      this.logger = new ProdLogger(this.options);
    } else {
      this.logger = new LocalDevLogger(this.options);
    }
    this.app.set('log', this.logger);
  }
}
