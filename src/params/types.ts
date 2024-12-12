import { ParamsSource } from '@/values';

export type ParamsOptionsArgs = any[] | IArguments;

export type ParamsOptionsParamsIn = <P1>(args: ParamsOptionsArgs, source: ParamsSource) => P1 | null;

export type ParamsOptionsParamsInFail = <RefuseResult>(args: ParamsOptionsArgs) => RefuseResult | null;

export type ParamsOptionsInject = <P1>(args: ParamsOptionsArgs, params: P1) => ParamsOptionsArgs;

export type ParamsOptions = {
  paramsIn?: ParamsOptionsParamsIn;
  paramsInFail?: ParamsOptionsParamsInFail;
  inject?: ParamsOptionsInject;
};
