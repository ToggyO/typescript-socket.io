/**
 * Description: Application settings import from .env.* files
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import { EnvironmentVars } from './types';

export class Environment {
  public envVariables: EnvironmentVars = {};
  private NODE_ENV = process.env.NODE_ENV || 'development';

  constructor() {
    const dotenvDir = path.join(process.cwd(), `.env.${this.NODE_ENV}`);
    this.envVariables = dotenv.parse(fs.readFileSync(dotenvDir));
    console.table(this.getVariablesForPrint());
  }

  private getVariablesForPrint() {
    return Object.keys(this.envVariables).reduce(
      (accumulator: EnvironmentVars, envName: string): EnvironmentVars => {
        const MAX_LENGTH = 80;
        const vars = this.envVariables;
        const variableIsNotEmpty: boolean = typeof vars[envName] === 'string' && vars[envName].length > 0;
        const useCutting: boolean = variableIsNotEmpty && vars[envName].length > MAX_LENGTH;
        const variable: string = useCutting ? `${vars[envName].substr(0, MAX_LENGTH)}...` : vars[envName];
        return {
          ...accumulator,
          [envName]: variable,
        };
      },
      {},
    );
  }
}
