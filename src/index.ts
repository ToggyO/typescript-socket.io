/**
 * Description: Root application file
 */

import 'reflect-metadata';
import 'module-alias/register';
import './module-aliases';

import config from 'config';
import { Startup } from 'services';

import { Application } from './app';

const { HOST, PORT } = config;

(async (): Promise<Application> => {
  const application = new Application({
    host: HOST,
    port: PORT,
    serviceConfiguration: new Startup(),
  });

  try {
    await application.runServices();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  application.listen();

  return application;
})();
