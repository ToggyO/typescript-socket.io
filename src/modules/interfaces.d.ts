/**
 * Description: Common module types and interfaces
 */

import { Roles } from 'db/entities/Users';
import { Token } from 'utils/authentication';

export type AuthData = {
  id: number;
  name: string;
  role: Roles.Admin | Roles.Gamer;
  rating?: number;
  token: Token;
};

export type QueriesPagination = Pick<Pagination, 'page' & 'pageSize'>;

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type GetPagination = {
  offset: number;
  limit: number;
};

export type GetParameters = FindOptions & { pagination: GetPagination };

export type GetListResponse<T> = {
  items: Array<T>;
  pagination: Pagination | Record<string, any>;
};
