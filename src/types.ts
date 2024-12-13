export type Constructor<T = any> = {
  new (...args: any[]): T;
};

export type FunctionArgs = any;

export type FunctionError = Error | unknown;
