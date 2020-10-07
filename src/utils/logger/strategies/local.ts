/**
 * Description: Class described development logger strategy.
 */

import path from 'path';
import chalk from 'chalk';
import notifier from 'node-notifier';

import { LoggerLevels, LoggerColors, Notify, LoggerProps } from '../interfaces';
import Logger from './base';

export default class LocalStrategy extends Logger {
  private levels: LoggerLevels;
  private colors: LoggerColors;

  constructor(props: LoggerProps) {
    super({ app: props.app });
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    this.colors = {
      debug: 'orange',
      warn: 'yellow',
      info: 'green',
      error: 'red',
    };
    this.logMethodsFabric(this.levels);
  }

  /**
   * Notification to local dev machine
   */
  private notify({ name, version, level, message }: Notify) {
    const options = {
      sound: true,
      wait: true,
      // Choose your icon
      icon: path.join(__dirname, '../deprecation.png'),
    };

    notifier.notify({
      title: `${name} v.${version} got ${level} message`,
      message,
      ...options,
    });
  }

  /**
   * Create list of handlers for each log types
   */
  protected logMethodsFabric(levels: LoggerLevels): void {
    const custom = super.transportFormatterCustom();
    const customConsole = custom({ type: 'console' });

    Object.keys(levels).forEach((level) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[level] = (message: unknown, options: Record<string, any> = {}) => {
        if (typeof message !== 'string') {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { color = this.colors[level] } = options;
        const coloredOutput = chalk.keyword(color);
        const { name = 'server', version = 'unknown' } = this.app;
        const logMessage = (() => {
          let msg;
          try {
            // FIXME: add second arg { type: 'console' }
            msg = JSON.stringify(customConsole.transform({ level, message }));
          } catch (error) {
            msg = '';
          }
          return msg;
        })();
        // FIXME: uncomment
        // this.notify({
        //   name,
        //   version,
        //   level,
        //   message,
        // });

        if (level !== 'error') {
          console.log(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
        } else {
          console.error(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
        }
      };
    });
  }
}
