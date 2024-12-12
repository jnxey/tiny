import { ParamsSource } from '@/values';
import { FunctionArgs } from '@/types';

export type ParamsOptionsParamsIn = <P1>(args: FunctionArgs, source: ParamsSource) => P1 | null;

export type ParamsOptionsParamsInFail = <RefuseResult>(args: FunctionArgs) => RefuseResult | null;

export type ParamsOptionsInject = <P1>(args: FunctionArgs, params: P1) => FunctionArgs;

export type ParamsOptions = {
  paramsIn?: ParamsOptionsParamsIn;
  paramsInFail?: ParamsOptionsParamsInFail;
  inject?: ParamsOptionsInject;
};
