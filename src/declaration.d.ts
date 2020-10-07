/**
 * Description: Extended express Request interface declaration
 */

import { Request } from 'express';

import { Gamers } from 'db/entities';

export interface ExtendedRequest extends Request {
  userData: Gamers;
}
