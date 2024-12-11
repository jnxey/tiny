import { ParamsSource, StatusCode } from '@/values';
import { copyAttrToNew } from '@/tools';
import { ExtendableContext, Next } from 'koa';
import { Dto } from '@/dto';
import { Model, ModelResult } from '@/model';
import { ParamsOptions, ParamsOptionsContext } from '@/params/types';

/*
 * Router parameter
 */
export class Params {
  /*
   * Obtain the context required for JWT through the parameters of the handler
   */
  public static context: ParamsOptionsContext = (args) => args;

  public static handlerIn = () => {};

  public static handlerFail = () => {};

  /*
   * Initialize Params configuration
   */
  public static init(options: ParamsOptions) {
    if (options.context) Params.context = options.context;
    if (options.handlerIn) Params.handlerIn = options.handlerIn;
    if (options.handlerFail) Params.handlerFail = options.handlerFail;
  }

  public static in<T extends Model>(params: { new (): T }, type: ParamsSource, validate: boolean = true, handler?: <P1, P2>(p1: P1, p2: P2) => T) {
    return function (_, __, descriptor: PropertyDescriptor) {
      const func: Function = descriptor.value;
      const _params = new params();
      descriptor.value.PARAMS_MODEL = _params.getConfigCache();
      if (!validate) return;
      descriptor.value = function () {
        const args = arguments;
        const ctx: ExtendableContext = args[0];
        const next: Next = args[1];
        const payload = args[2]?.payload;
        const current: object = type === ParamsSource.body ? ctx.request.body : ctx.query;
        const result: ModelResult = _params.fill(!!handler ? handler(current ?? {}, payload) : (current ?? {}));
        if (result.valid) {
          const extend = new DtoCtxExtend({ ...(args[2] || {}), params: _params });
          return func.call(this, ctx, next, extend);
        } else {
          ctx.body = new Dto({ code: StatusCode.paramsError, msg: result.message });
          return next();
        }
      };
      copyAttrToNew(descriptor.value, func);
    };
  }

  public static out<T extends Model>(result: { new (): T }): Function {
    return function (_, __, descriptor: PropertyDescriptor) {
      const _result = new result();
      descriptor.value.RESULT_MODEL = _result.getConfigCache();
    };
  }
}
