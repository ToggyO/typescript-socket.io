import path from 'path';
import { format } from 'winston';
import { FormatWrap, TransformableInfo } from 'logform';

import { LoggerLevels, LoggerProps } from '../interfaces';

export default class Logger {
  protected app: any;

  constructor({ app }: Pick<LoggerProps, 'app'>) {
    this.app = app;
  }

  /**
   * Custom format for Winston
   */
  protected transportFormatterCustom(): FormatWrap {
    return format((info: TransformableInfo): TransformableInfo => this.transportDataFormatter(info));
  }

  /**
   * Prepare data log structure for Winston
   */
  protected transportDataFormatter(info: TransformableInfo): TransformableInfo {
    const { version } = this.app;
    const now = new Date();
    const accidentAt = now.toISOString();
    const wasLaunchedAt = this.getUpDate();

    if (wasLaunchedAt) {
      info.wasLaunchedAt = wasLaunchedAt;
    }
    if (accidentAt) {
      info.accidentAt = accidentAt;
    }
    if (version) {
      info.version = version;
    }

    return info;
  }

  private getUpDate(): string {
    const now = Date.now();
    const upTime = process.uptime();
    const upDateInMS = now - upTime;
    const upDate = new Date(upDateInMS).toISOString();
    return upDate;
  }

  /**
   * Create list of handlers for each log types
   */
  protected logMethodsFabric(levels: LoggerLevels): void {
    console.log(levels);
  }
}
