/**
 * Description: Connection to Postgres SQL
 */

import express from 'express';

import { db } from 'db';
import { IConnector } from 'db/interfaces';

import { IService } from '../interfaces';

/**
 * Starting the process of connecting to the database
 */
export class DatabaseConnection implements IService {
  public app: express.Application;
  private readonly connector;

  constructor(app: express.Application, connector: IConnector) {
    this.app = app;
    this.connector = connector;
  }

  public async run(): Promise<void> {
    try {
      await this.connector.init();
      console.info('Successfully connected to database!');
      this.app.set('db', db);
    } catch (error) {
      console.info('Database connection error: ', error);
    }
  }
}
