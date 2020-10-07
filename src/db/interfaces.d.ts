/**
 * Description: Database connection types and interfaces
 */

export interface IConnector {
  init(): Promise<void>;
  init(...args: any[]): Promise<void>;
}
