import { DataType, MethodType } from '@/values';
import { ContextBase } from '@/context/types';

export type ControllerRouterFunc = (path: string, handler: Function) => void;

export type ControllerOptions = {
  prefix?: string;
  format?: boolean;
  get?: ControllerRouterFunc;
  post?: ControllerRouterFunc;
  delete?: ControllerRouterFunc;
  put?: ControllerRouterFunc;
};

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
  PARAMS_MODEL?: object;
  RESULT_MODEL?: object;
}
