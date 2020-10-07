/**
 * Description: Common modules abstractions
 */

import express from 'express';
import { BaseEntity } from 'typeorm';

import { getProp, isObjectEmpty } from 'utils/helpers';

import { GetPagination, Pagination, QueriesPagination } from './interfaces';

export abstract class Module {
  public router: express.Router = express.Router();

  /**
   * Method to initialize all routers
   */
  public createRouter(): express.Router {
    return this.router;
  }

  /**
   * Method to initialize swagger
   */
  public initializeSwagger(): void {}
}

export abstract class BaseRouter {
  public router: express.Router = express.Router();

  /**
   * Method to initialize the router
   */
  public initRoutes(): express.Router {
    return this.router;
  }
}

export class BaseService {
  /**
   * Set values on entity properties
   */
  public static setEntityProperties<T extends BaseEntity>(Entity: T, properties: Record<string, any>): T {
    Object.entries(properties).forEach(([key, value]: [keyof typeof properties, any]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Entity[key] = value;
    });
    return Entity;
  }

  /**
   * Preparation and formatting of input data for creating / modifying an entity
   */
  public static dryPayload<T extends Record<string, any>, U extends Record<string, any>>(
    payload: T,
    schema: U,
  ): Record<string, any> {
    return Object.keys(schema).reduce((accumulator, propName) => {
      let data: Record<string, any> = {};
      try {
        const value = schema[propName](payload[propName]);
        if (typeof value !== 'undefined') {
          data[propName] = value;
        }
      } catch (error) {
        data = {};
      }
      return {
        ...accumulator,
        ...data,
      };
    }, {});
  }

  /**
   * Use formatted pagination parameters `offset`,` limit`
   */
  public static getPagination({ query }: { query: QueriesPagination }): GetPagination {
    let page = +getProp(query, 'page', 0);
    let pageSize = +getProp(query, 'pageSize', 0);

    if (Number.isNaN(page) || page < 0) {
      page = 0;
    }
    if (Number.isNaN(pageSize) || pageSize <= 0) {
      pageSize = 10;
    }

    return {
      offset: page * pageSize,
      limit: pageSize,
    };
  }

  /**
   * Pagination response format
   */
  public static getPaginationResponse(
    result: { count: number },
    pagination: GetPagination,
  ): Pagination | Record<string, any> {
    if (isObjectEmpty(pagination)) {
      return {};
    }

    return {
      page: Math.abs(pagination.offset / pagination.limit),
      pageSize: pagination.limit,
      total: getProp(result, 'count', 0),
    };
  }
}
