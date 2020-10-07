/**
 * Description: This class creates application services.
 * Add your service to 'createServices' method through the 'addService' method
 */

import { Server } from 'http';
import express from 'express';

import config from 'config';
import { db } from 'db';
import { IService, IServiceConfiguration } from 'interfaces';
import { ModuleV1 } from 'modules/v1/initialize';
import { SOCKET_CONNECTION_OPTIONS } from 'constants/socket-options';

import { CreateLogger } from './logger';
import { ServerSettings } from './common';
import { DatabaseConnection } from './db';
import { Modules } from './modules';
import { CreateSocket } from './socket';
import { ErrorHandler } from './errorHandler';
import pack from '../../package.json';

export class Startup implements IServiceConfiguration {
  public services: IService[] = [];

  public configureServices(app: express.Application, server: Server): void {
    this.addService(
      new CreateLogger(app, {
        mode: config.NODE_ENV,
        app: {
          name: pack.name,
          version: pack.version,
        },
      }),
    );
    this.addService(new ServerSettings(app));
    this.addService(new DatabaseConnection(app, db));
    this.addService(new Modules(app, new ModuleV1()));
    this.addService(new CreateSocket(app, server, SOCKET_CONNECTION_OPTIONS));
    this.addService(new ErrorHandler(app));
  }

  private addService(service: IService): void {
    this.services.push(service);
  }
}
