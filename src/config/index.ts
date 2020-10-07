/**
 * Description: Application settings export
 */

import { Environment } from './env';
import { AppConfig } from './types';

const environment = new Environment();
const envVars = environment.envVariables;

export const isProduction: boolean = envVars.NODE_ENV === 'production';

const config: AppConfig = {
  ...envVars,
};

export default config;
