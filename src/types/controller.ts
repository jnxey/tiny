import { ExtendableContext, Next } from 'koa';
import { KoaBodyMiddlewareOptions } from 'koa-body/lib/types';
import { DataType, MethodType } from '@/values';

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
  DATA_TYPE_OPTIONS?: Partial<KoaBodyMiddlewareOptions>;
}
