/** @format */

export interface successInterface<T> {
  type: 'SUCCESS';
  context: string;
  data: T;
  options: any;
}

export interface errorInterface {
  type: 'ERROR';
  context: string;
  errorMessage: string;
  error: any;
  options: any;
}

export interface receiveInterface<T> {
  data: T;
  options: any;
}
