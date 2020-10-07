/**
 * Description: Socket connection service
 */

import * as http from 'http';
import * as express from 'express';
import socketIo from 'socket.io';

import { SocketConnector } from 'utils/socket';

import { IService } from '../interfaces';

export class CreateSocket implements IService {
  public app: express.Application;
  public server: http.Server;
  public options: socketIo.ServerOptions;

  constructor(app: express.Application, server: http.Server, options: socketIo.ServerOptions) {
    this.app = app;
    this.server = server;
    this.options = options;
  }

  public run(): void {
    const { server, options } = this;
    new SocketConnector(server, options);
  }
}
