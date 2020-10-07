/**
 * Description: Gamer module router
 */

import express from 'express';

import { BaseRouter } from 'modules/common';
import { asyncWrapper } from 'utils/helpers';

import { GamerController } from './gamer.controller';
import { authenticate } from 'utils/authentication';
import { Roles } from 'db/entities/Users';

/**
 * Router: Gamer
 */
export class CreateRouter extends BaseRouter {
  public initRoutes(): express.Router {
    const { router } = this;

    router.post('/login', asyncWrapper(GamerController.loginOrCreateGamer));

    router.get('/me', asyncWrapper(authenticate([Roles.Gamer])), asyncWrapper(GamerController.getProfile));

    router.get(
      '/profile/:id',
      asyncWrapper(authenticate([Roles.Admin, Roles.Gamer])),
      asyncWrapper(GamerController.getGamer),
    );

    return this.router;
  }
}
