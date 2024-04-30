import { ExtendableContext, Next } from 'koa';
import { KoaBodyMiddlewareOptionsSchema } from 'koa-body/lib/types';

export type ControllerOptions = {
  prefix: string;
};

export type ControllerOptionsInput = {
  prefix?: string;
};

export interface ControllerHandler {
  (ctx: ExtendableContext, next: Next): number;
  METHOD?: string;
  DATA_TYPE?: string;
  PREFIX?: string;
  MAPPING?: string;
  SUMMARY?: string;
  JWT_PROTECTED?: boolean;
  DATA_TYPE_OPTIOINS?: KoaBodyMiddlewareOptionsSchema;
}
