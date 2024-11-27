import { ExtendableContext, Next } from 'koa';
import { DataType, MethodType } from '@/values';
import Router from '@koa/router';

export type ControllerOptions = {
  prefix: string;
  hump: boolean;
};

export type ControllerOptionsInput = {
  prefix?: string;
  hump?: boolean;
};

export interface ControllerHandler {
  (ctx: ExtendableContext, next: Next): number;
  METHOD?: MethodType;
  DATA_TYPE?: DataType;
  PREFIX?: string;
  MAPPING?: string;
  SUMMARY?: string;
  JWT_PROTECTED?: boolean;
  DATA_TYPE_HANDLER?: Router.Middleware;
  PARAMS_MODEL?: object;
  RESULT_MODEL?: object;
}
