/**
 * Description: Types and interfaces for Validator class
 */

export type ValidatorConstructorParameters = {
  value: any;
  field: string;
  shouldTrimValue?: boolean;
  additionalParams?: Record<string, any>;
};

export type ValidatorError = {
  field?: any;
  fields?: any[];
  errorCode: string | number;
  errorMessage: string | number;
};
