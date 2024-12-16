import { DataType, MethodType, ParamsType } from '@/values';

export type ConnectOptions = {
  prefix?: string;
  format?: boolean;
};

export type ControllerApiJson = {
  module: string;
  describe?: string;
  func: string;
  path: string;
  method: string;
  requestType?: string;
  responseType?: string;
  summary?: string;
  paramsModel?: object;
  resultModel?: object;
  paramsInType?: string;
};

export interface ConnectResult {
  path: string;
  method: MethodType;
  handler: Function;
  options: ControllerApiJson;
}

export interface ControllerHandler {
  <T>(): T;
  METHOD?: MethodType;
  REQUEST_TYPE?: DataType;
  RESPONSE_TYPE?: DataType;
  PREFIX?: string;
  MAPPING?: string;
  SUMMARY?: string;
  JWT_PROTECTED?: boolean;
  HANDLER?: Function;
  PARAMS_IN_MODEL?: object;
  PARAMS_IN_TYPE?: ParamsType;
  PARAMS_OUT_MODEL?: object;
}
