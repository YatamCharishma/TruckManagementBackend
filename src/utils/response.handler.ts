/** @format */

import { errorInterface, successInterface } from './response.interface';

import { HttpException, HttpStatus } from '@nestjs/common';

export function createSuccess<T>(
  context: any,
  data: any,
  options = null,
): successInterface<T> {
  return <successInterface<T>>{
    type: 'SUCCESS',
    context: context == null ? null : context,
    dataLength: data == null ? 0 : data.length,
    data: data == null ? null : data,
    options: options == null ? null : options,
  };
}

export class ErrorException extends HttpException {
  constructor(context: any, errorMessage: any, error, options = null) {
    const errorObject: errorInterface = <errorInterface>{
      type: 'ERROR',
      context: context == null ? null : context,
      errorMessage: errorMessage == null ? null : errorMessage,
      error: error == null ? null : error,
      options: options == null ? null : options,
    };
    super(errorObject, HttpStatus.BAD_REQUEST);
    console.error(`\nERROR OCCURRED @ ${new Date()}:`);
    console.error(errorObject);
  }
}

export function removeTrailingComma(inputStr: string): string {
  return inputStr.replace(/(^,)|(,$)/g, '');
}

export function removeQuotes(inputStr: string): string {
  return inputStr.replace(/['"]+/g, '');
}
