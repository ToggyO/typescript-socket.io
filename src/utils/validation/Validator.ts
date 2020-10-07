/**
 * Description: The helper class (and the function that initializes it)
 * to validate the input parameters of requests
 */

import validator from 'validator';

import { VALIDATION_ERRORS } from 'constants/validation-errors';

import { ValidatorConstructorParameters, ValidatorError } from './types';

export class Validator {
  protected error: ValidatorError | null;
  protected value: any;
  protected field: string;
  protected additionalParams: Record<string, any>;

  /**
   * A constant that determines whether the error array should be returned empty
   */
  protected shouldReturnEmptyError = false;

  constructor({
    value,
    field,
    shouldTrimValue = true,
    additionalParams = {},
  }: ValidatorConstructorParameters) {
    this.error = null;
    this.value = shouldTrimValue && typeof value === 'string' ? value.trim() : value;
    this.field = field;
    this.additionalParams = additionalParams;
  }

  /**
   * Set new error as result of validation
   */
  private setNewError = ({ field, errorCode, errorMessage }: ValidatorError): void => {
    this.error = {
      field,
      errorCode,
      errorMessage,
    };
  };

  /**
   * return validation result
   */
  public result(): ValidatorError[] {
    if (this.shouldReturnEmptyError) {
      return [];
    }
    return this.error ? [this.error] : [];
  }

  /**
   * Validation: optional parameter
   * Stops the validation chain when the validation value is empty
   */
  public notRequired(): this {
    if (!this.value && this.value !== false) {
      this.shouldReturnEmptyError = true;
    }
    return this;
  }

  /**
   * Validation: required parameter
   */
  public required = (required = true): this => {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (!required) {
      this.notRequired();
      return this;
    }
    if (!this.value && this.value !== false && this.value !== 0) {
      this.setNewError(VALIDATION_ERRORS.requiredField({ field: this.field }));
    }
    return this;
  };

  /**
   * Validation: value is a number
   */
  public isNumber(): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (typeof this.value !== 'number') {
      this.setNewError(VALIDATION_ERRORS.isNumber({ field: this.field }));
    }
    return this;
  }

  /**
   * Validation: correct email
   */
  public email(): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (!validator.isEmail(this.value)) {
      this.setNewError(VALIDATION_ERRORS.invalidEmailFormat({ field: this.field }));
    }
    return this;
  }

  /**
   * Validation: password format
   */
  public password(): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    // const patternNums = /[0-9]+/;
    // const patternLowSyms = /[a-z]+/;
    // const patternUppSyms = /[A-Z]+/;
    // const patternMinLen = /.{8,}/;
    // const isValid = (patternNums.test(this.value) && patternLowSyms.test(this.value)
    // && patternUppSyms.test(this.value) && patternMinLen.test(this.value)); // eslint-disable-line max-len
    const isValid = /^[0-9a-zA-Z~!@#$%^&*_\-+=`|(){}[\]:;"'<>,.?/]+$/.test(this.value);

    if (!isValid) {
      this.setNewError(VALIDATION_ERRORS.isInvalidPasswordFormat({ field: this.field }));
    }
    return this;
  }
}
