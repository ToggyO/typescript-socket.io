import jwt from 'jsonwebtoken';

import config from 'config';
import { parseEnvExpireTime } from 'utils/format';

import { Token, TokenPayload } from './types';

/**
 * Token generation
 */
export const generateToken = ({ userId, name, role, rating }: TokenPayload): Token => {
  const { JWT_SECRET, JWT_ACCESS_EXPIRES_IN } = config;

  return {
    accessToken: jwt.sign(
      {
        userId,
        name,
        role,
        rating,
        type: 'access',
      },
      JWT_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN },
    ),
    accessExpire: parseEnvExpireTime(JWT_ACCESS_EXPIRES_IN),
  };
};
