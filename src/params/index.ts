import { ParamsConfigCache, ParamsSource, ParamsType, StatusCode } from '@/values';
import { isBoolean, isEmpty, isString } from '@/tools';
import { ExtendableContext } from 'koa';

/*
 * 参数模型
 */
export function Params<T extends ParamsModel>(params: { new (): T }, type: ParamsSource): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const func: Function = descriptor.value;
    const _params = new params();
    descriptor.value = function (): any {
      const args = arguments;
      const ctx: ExtendableContext = args[0];
      const current: object = type === ParamsSource.body ? ctx.request.body : ctx.query;
      const result: ParamsModelResult = _params.fill(current);
      if (result.valid) {
        ctx.params = _params;
        return func.apply(this, args);
      } else {
        ctx.throw(StatusCode.paramsError, result.message);
      }
    };
  };
}

/*
 * 参数模型
 */
export class ParamsModel {
  // 默认值
  public static def = {
    number: 0,
    boolean: true,
    string: ''
  };

  // 填充
  public fill<T>(map: object) {
    const paramsConfig = this.constructor[ParamsConfigCache];
    if (!paramsConfig) return new ParamsModelResult(true);
    for (let name in paramsConfig) {
      if (!paramsConfig.hasOwnProperty(name)) continue;
      const hasNull = isEmpty(map[name]);
      if (paramsConfig[name].required && hasNull) {
        return new ParamsModelResult(false, paramsConfig[name].requiredMessage);
      }
      if (!hasNull && paramsConfig[name].type === ParamsType.number && isNaN(Number(map[name]))) {
        return new ParamsModelResult(false, paramsConfig[name].typeErrorMessage);
      }
      if (!hasNull && paramsConfig[name].type === ParamsType.boolean && !isBoolean(map[name])) {
        return new ParamsModelResult(false, paramsConfig[name].typeErrorMessage);
      }
      if (!hasNull && paramsConfig[name].type === ParamsType.string && !isString(map[name])) {
        return new ParamsModelResult(false, paramsConfig[name].typeErrorMessage);
      }
      if (!hasNull && paramsConfig[name].type instanceof ParamsModel) {
        const model = new paramsConfig[name]();
        const result: ParamsModelResult = model.fill(map[name]);
        if (!result.valid) return result;
      }

      this[name] = map[name];
    }
    return new ParamsModelResult(true);
  }
}

/*
 * 返回结果
 */
export class ParamsModelResult {
  public valid: boolean = false;
  public message: string = '';
  constructor(valid: boolean, message?: string) {
    this.valid = valid;
    this.message = message || '';
  }
}

/**
 * 添加参数声明，以及描述提示语
 */
export function Declare(description?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ParamsConfigCache][propertyKey].description = description;
  };
}

/**
 * 添加参数提示语
 */
export function Required(message?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ParamsConfigCache][propertyKey].required = true;
    target.constructor[ParamsConfigCache][propertyKey].requiredMessage = message;
  };
}

/**
 * 添加类型错误提示语
 */
export function TypeError<T>(type: ParamsType | T, message?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ParamsConfigCache][propertyKey].type = type;
    target.constructor[ParamsConfigCache][propertyKey].typeErrorMessage = message;
  };
}

/**
 * 检查参数配置是否存在
 */
function _checkParamsConfigExist(target: any, propertyKey: string) {
  if (!target.constructor[ParamsConfigCache]) target.constructor[ParamsConfigCache] = {};
  if (!target.constructor[ParamsConfigCache][propertyKey]) target.constructor[ParamsConfigCache][propertyKey] = {};
}
