import { ParamsSource, StatusCode } from '@/values';
import { copyAttrToNew } from '@/tools';
import { Model, ModelResult } from '@/model';
import { ContextBase } from '@/context/types';
import { Dto } from '@/dto';

/*
 * Router parameter
 */
export class Params {
  /*
   * Params in refuse
   */
  static refuse = (context: ContextBase, message: string) => {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.paramsError, msg: message, result: null }));
  };

  /*
   * Params.in Decorator: Intercept and process incoming parameters of the request
   */
  public static in<T extends Model>(params: { new (): T }, type: ParamsSource, validate: boolean = true, filter?: <P1>(p1: P1) => T) {
    return function (_, __, descriptor: PropertyDescriptor) {
      const next: Function = descriptor.value;
      const _params = new params();
      descriptor.value.PARAMS_MODEL = _params.getConfigCache();
      if (!validate) return;
      descriptor.value = function (context: ContextBase) {
        const params = type === ParamsSource.body ? context.body : context.query;
        const result: ModelResult = _params.fill(!!filter ? filter(params) : params);
        if (result.valid) {
          context.setParams(_params);
          return next.call(this, context);
        } else {
          return Params.refuse(context, result.message);
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
