import { ParamsSource, StatusCode } from '@/values';
import { copyAttrToNew } from '@/tools';
import { ExtendableContext, Next } from 'koa';
import { DtoCtxExtend, Dto } from '@/dto';
import { Model, ModelResult } from '@/model';

/*
 * 参数模型
 */
export function Params<T extends Model>(params: { new (): T }, type: ParamsSource, validate: boolean = true): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const func: Function = descriptor.value;
    const _params = new params();
    descriptor.value.PARAMS_MODEL = _params.getConfigCache();
    if (!validate) return;
    descriptor.value = function (): any {
      const args = arguments;
      const ctx: ExtendableContext = args[0];
      const next: Next = args[1];
      const current: object = type === ParamsSource.body ? ctx.request.body : ctx.query;
      const result: ModelResult = _params.fill(current ?? {});
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

/*
 * 结果模型
 */
export function Result<T extends Model>(result: { new (): T }): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const _result = new result();
    descriptor.value.RESULT_MODEL = _result.getConfigCache();
  };
}
