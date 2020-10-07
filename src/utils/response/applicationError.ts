/**
 * Description: Response error global constructor
 */

import { IApplicationError } from 'interfaces';

import { ERROR_CODES } from 'constants/error-codes';
import { INTERNAL_ERROR } from 'constants/response-codes';

class ApplicationError extends Error {
  errorMessage;
  errorCode;
  errors;
  statusCode: string | number | undefined;
  name = 'ApplicationError';

  constructor({
    errorMessage = 'Unknown error',
    errorCode = ERROR_CODES.internal_server_error,
    errors = [],
    statusCode = INTERNAL_ERROR,
  }: IApplicationError) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    } else {
      this.stack = new Error().stack;
    }

    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
    this.errors = errors;
    this.statusCode = statusCode;
    this.name = 'ApplicationError';
  }
}

export { ApplicationError };
