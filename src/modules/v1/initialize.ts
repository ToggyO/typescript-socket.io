/**
 * Description: Global initialization of the 1st version of API
 */

import { Router } from 'express';

import { Module } from '../common';
// Routing initializers
import { CreateRouter as CreateAdminRouter } from './admin/admin.router';
import { CreateRouter as CreateGamerRouter } from './gamer/gamer.router';

export class ModuleV1 extends Module {
  public router: Router = Router();

  /**
   * Initializing routing
   */
  public createRouter(): Router {
    this.router.use('/admin', new CreateAdminRouter().initRoutes());
    this.router.use('/gamer', new CreateGamerRouter().initRoutes());

    return this.router;
  }
}
