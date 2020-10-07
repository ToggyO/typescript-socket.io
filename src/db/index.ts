/**
 * Description: Class for interacting with the database and common system methods
 */

import { Connection, createConnection, getConnection } from 'typeorm';

import { IConnector } from './interfaces';

export class Connector implements IConnector {
  /**
   * Initialize connection
   */
  public async init(): Promise<void> {
    await createConnection();
  }

  /**
   * Connection instance getter
   */
  get Connection(): Connection | null {
    return getConnection();
  }
}

export const db = new Connector();
