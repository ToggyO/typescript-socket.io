/**
 * Description: Admin module router
 */

import express from 'express';

import { Roles } from 'db/entities/Users';
import { BaseRouter } from 'modules/common';
import { asyncWrapper } from 'utils/helpers';
import { authenticate } from 'utils/authentication';

import { AdminController } from './admin.controller';

/**
 * Router: Admin
 */
export class CreateRouter extends BaseRouter {
  public initRoutes(): express.Router {
    const { router } = this;

    router.post('/login', asyncWrapper(AdminController.loginAsAdmin));

    router.post(
      '/reset-rating',
      asyncWrapper(authenticate([Roles.Admin])),
      asyncWrapper(AdminController.resetRating),
    );

    router.post(
      '/recalculate-rating',
      asyncWrapper(authenticate([Roles.Admin])),
      asyncWrapper(AdminController.recalculateRating),
    );

    return this.router;
  }
}
