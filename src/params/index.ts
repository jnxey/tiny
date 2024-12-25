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
    context.send(new Dto(null, StatusCode.paramsError, message));
  };

  /*
   * Params.in Decorator: Intercept and process incoming parameters of the request
   */
  public static in<T extends Model>(model: { new (): T }, type: ParamsSource, validate: boolean = true, filter?: <P1>(p1: P1) => T) {
    return function (_, __, descriptor: PropertyDescriptor) {
      const next: Function = descriptor.value;
      descriptor.value.PARAMS_IN_MODEL = new model();
      descriptor.value.PARAMS_IN_TYPE = type;
      if (!validate) return;
      descriptor.value = function (context: ContextBase) {
        const _params = new model();
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
  public static out<T extends Model>(model: { new (): T }): Function {
    return function (_, __, descriptor: PropertyDescriptor) {
      descriptor.value.PARAMS_OUT_MODEL = new model();
    };
  }
}
