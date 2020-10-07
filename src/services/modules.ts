/**
 * Description: Modules service
 */

import * as express from 'express';

import { IService } from 'interfaces';
import { Module } from 'modules/common';

export class Modules implements IService {
  public app: express.Application;
  readonly modules: Module;

  constructor(app: express.Application, modules: Module) {
    this.app = app;
    this.modules = modules;
  }

  public run(): void {
    const { modules } = this;
    this.app.use('/', modules.createRouter());
  }
}
