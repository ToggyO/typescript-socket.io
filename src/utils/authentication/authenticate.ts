/**
 * Middleware checks user access rights based on his role
 */

import { NextFunction, Response } from 'express';
import { Request } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

import { ExtendedRequest } from 'declaration';
import config from 'config';
import { GamerService } from 'modules/v1/gamer/gamer.service';
import { ApplicationError } from 'utils/response';
import { TokenPayload } from 'utils/authentication';
import { ERROR_CODES } from 'constants/error-codes';
import { Roles } from 'db/entities/Users';

export const unauthorizedErrorPayload = {
  statusCode: 401,
  errorMessage: 'Access token is expired or invalid',
  errorCode: ERROR_CODES.security__invalid_token_error,
  errors: [],
};

/**
 * Check if token is valid
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const checkToken = async (token: string): Promise<object | string> => {
  const { JWT_SECRET } = config;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      throw new ApplicationError(unauthorizedErrorPayload);
    }
    throw error;
  }
};

/**
 * Creating an intermediate handler for checking the access rights of a route
 */
export const authenticate = (allowedRoles: Roles[] = []) => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { AUTHORIZATION_HEADER } = config;

  const accessToken = (req.get(AUTHORIZATION_HEADER.toLowerCase()) || '').replace('Bearer ', '');

  if (!accessToken) {
    throw new ApplicationError(unauthorizedErrorPayload);
  }

  const { userId } = (await checkToken(accessToken)) as TokenPayload;

  const userData = await GamerService.getGamer({ where: { id: userId } });

  if (!userData) {
    throw new ApplicationError(unauthorizedErrorPayload);
  }

  if (allowedRoles !== null && !allowedRoles.includes(userData.role)) {
    throw new ApplicationError({
      statusCode: 403,
      errorMessage: 'Permission denied',
      errorCode: ERROR_CODES.security__no_permissions,
      errors: [],
    });
  }

  (req as ExtendedRequest).userData = userData;

  next();
};
