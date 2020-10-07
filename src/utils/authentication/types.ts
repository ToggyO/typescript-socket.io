/**
 * Description: Types and interfaces for authenticate utils
 */

import { Roles } from 'db/entities/Users';

export type TokenPayload = {
  userId: number;
  name: string;
  role: Roles;
  rating: string;
};

export type Token = {
  accessToken: string;
  accessExpire: string;
};
