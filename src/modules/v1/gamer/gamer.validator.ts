/**
 * Description: Validators for the gamer service
 */

import { Validator, ValidatorError } from 'utils/validation';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';

import { USER_ERROR_MESSAGES } from './constants';
import { CreateGamerPayload } from './types';

export class GamerValidator {
  /**
   * Create gamer validator
   */
  public static createUserValidator(values: CreateGamerPayload): void {
    const { name, password } = values;

    const errors: ValidatorError[] = [
      ...new Validator({ value: name, field: 'name' }).required().result(),
      ...new Validator({ value: password, field: 'password' }).required().password().result(),
    ];

    if (errors.length) {
      throw new ApplicationError({
        statusCode: 400,
        errorMessage: USER_ERROR_MESSAGES.USER_CREATION_ERROR,
        errorCode: ERROR_CODES.validation,
        errors,
      });
    }
  }
}
