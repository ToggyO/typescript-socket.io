/**
 * Description: Helper functions
 */

/**
 * Check if the value is not empty
 */
export function isEmpty(val: any): boolean {
  return val === undefined || val == null || val.length <= 0;
}

/**
 * Check if object is empty
 */
export function isObjectEmpty(object: Record<any, any>): boolean {
  return Object.keys(object).length > 0;
}

/**
 * Lodash.get function implementation
 * Lets you safely retrieve a property of an object
 * https://gist.github.com/harish2704/d0ee530e6ee75bad6fd30c98e5ad9dab
 */
export function getProp<T extends Record<string, any>, U extends any>(
  object: Record<string, any>,
  keys: string | Array<string>,
  defaultVal?: U,
): T | U {
  const keysArray = Array.isArray(keys) ? keys : keys.split('.');
  const result = object[keysArray[0]];
  if (result && keysArray.length > 1) {
    return getProp(result, keysArray.slice(1));
  }

  if (object === undefined) {
    return defaultVal as U;
  }

  return result;
}

/**
 * Separating a file extension from a file name
 */
export function getFileExtension(filename: string): [string, string] {
  const fileName = filename.replace(/\.[^/.]+$/, '');
  const ext = filename.split('.').pop();
  return [fileName, ext!];
}

/**
 * Helper for Array.sort():
 * Compare objects by rank property
 */
export function compareByRank(a: Record<any, any>, b: Record<any, any>): number {
  if (a.rank < b.rank) {
    return -1;
  }
  if (a.rank < b.rank) {
    return -1;
  }
  return 0;
}

/**
 * Returns the number of points to update the rating
 */
export function setGamersRating(rank: number): number {
  switch (rank) {
    case 1:
      return 0.5;
    case 2:
      return 0.3;
    case 4:
      return -0.3;
    case 5:
      return -0.5;
    default:
      return 0;
  }
}
