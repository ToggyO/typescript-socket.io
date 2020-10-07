/**
 * Description: Main application class, create base application configuration
 */

import http, { Server } from 'http';
import express from 'express';

import config from 'config/index';

import { AppConstructor, IApplication, IService } from './interfaces';

export class Application implements IApplication {
  public app: express.Application;
  public server: Server;
  public host = '0.0.0.0';
  public port: string | number = 5001;
  readonly NODE_ENV: string;
  readonly services: IService[] = [];

  constructor({ host, port, serviceConfiguration }: AppConstructor) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.host = host;
    this.port = port;
    this.NODE_ENV = config.NODE_ENV;
    serviceConfiguration.configureServices(this.app, this.server);
    this.services = serviceConfiguration.services;
  }

  public async runServices(): Promise<void> {
    for (const service of this.services) {
      await service.run();
    }
  }

  public listen(): void {
    this.server.listen({ host: this.host, port: this.port }, () => {
      this.app
        .get('log')
        .info(`Server running at http://${this.host}:${this.port}, in ${this.NODE_ENV} mode.`);
    });
  }
}
