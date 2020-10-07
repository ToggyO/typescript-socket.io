import moment, { DurationInputArg2 } from 'moment';

/**
 * Parsing token lifetime
 */
export function parseEnvExpireTime(expireTime: string): string {
  const digits = expireTime.match(/\d/g);
  const words = expireTime.match(/\D/g);
  return moment()
    .add(digits![0], words![0] as DurationInputArg2)
    .toISOString();
}
