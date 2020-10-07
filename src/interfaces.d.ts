/**
 * Description: Base application interfaces and types
 */

import { Server } from 'http';

export interface IApplication {
  app: express.Application;
  host: string;
  port: string | number;
  readonly NODE_ENV: string;
  readonly services: IService[];
  runServices(): Promise<void> | void;
  listen(): void;
}

export interface IService {
  app: express.Application;
  run(): void;
}

export interface IApplicationError {
  errorMessage: string;
  errorCode: string | number;
  errors: any[];
  statusCode: string | number | undefined;
  message?: string | undefined;
}

export interface IServiceConfiguration {
  services: IService[];
  configureServices(app: express.Application, server?: Server): void;
}

export type AppConstructor = {
  host: string;
  port: string | number;
  serviceConfiguration: IServiceConfiguration;
};
