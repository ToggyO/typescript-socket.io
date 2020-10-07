/**
 * Description: Logger interfaces.
 */
import { Format, FormatWrap, TransformableInfo } from 'logform';
import Logger from './strategies/base';

export type LoggerLevels = {
  error?: number;
  warn?: number;
  info?: number;
  debug?: number;
};

export type LoggerColors = {
  error?: string;
  warn?: string;
  info?: string;
  debug?: string;
};

export type LoggerProps = {
  mode: 'production' | 'development' | string;
  app: {
    name: string;
    version: string;
  };
};

export type Notify = {
  name: string;
  version: string;
  level: string;
  message: string;
};
