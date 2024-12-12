import { ParamsSource } from '@/values';
import { copyAttrToNew } from '@/tools';
import { Model, ModelResult } from '@/model';
import { ParamsOptions, ParamsOptionsInject, ParamsOptionsParamsIn, ParamsOptionsParamsInFail } from '@/params/types';
import { FunctionArgs } from '@/types';

/*
 * Router parameter
 */
export class Params {
  /*
   * Retrieve the entered parameters
   */
  public static paramsIn: ParamsOptionsParamsIn = () => null;

  /*
   * Dealing with parameter validation failures
   */
  public static paramsInFail: ParamsOptionsParamsInFail = () => null;

  /*
   * Inject the correct parameters
   */
  public static inject: ParamsOptionsInject = (args) => args;

  /*
   * Initialize Params configuration
   */
  public static init(options: ParamsOptions) {
    if (options.paramsIn) Params.paramsIn = options.paramsIn;
    if (options.paramsInFail) Params.paramsInFail = options.paramsInFail;
    if (options.inject) Params.inject = options.inject;
  }

  /*
   * Params.in Decorator: Intercept and process incoming parameters of the request
   */
  public static in<T extends Model>(params: { new (): T }, type: ParamsSource, validate: boolean = true, handler?: <P1>(p1: P1) => T) {
    return function (_, __, descriptor: PropertyDescriptor) {
      const next: Function = descriptor.value;
      const _params = new params();
      descriptor.value.PARAMS_MODEL = _params.getConfigCache();
      if (!validate) return;
      descriptor.value = function (...args: FunctionArgs) {
        const params = Params.paramsIn(args, type);
        const result: ModelResult = _params.fill(!!handler ? handler(params) : params);
        if (result.valid) {
          return next.apply(this, Params.inject(args, params));
        } else {
          return Params.paramsInFail.call(this, args);
        }
      };
      copyAttrToNew(descriptor.value, next);
    };
  }

  /*
   * Params.out Decorator: Declare the parameters of the response
   */
  public static out<T extends Model>(result: { new (): T }): Function {
    return function (_, __, descriptor: PropertyDescriptor) {
      const _result = new result();
      descriptor.value.RESULT_MODEL = _result.getConfigCache();
    };
  }
}
