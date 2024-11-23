/*
 * 参数模型
 */
import { ModelConfigCache, ParamsType } from '@/values';
import { isBoolean, isEmpty, isString } from '@/tools';

export class Model {
  // 默认值
  public static def = {
    number: 0,
    boolean: true,
    string: '',
    null: null
  };

  // 获取config
  public getConfigCache() {
    return this.constructor[ModelConfigCache];
  }

  // 填充
  public fill<T>(map: object) {
    const modelConfig = this.constructor[ModelConfigCache];
    if (!modelConfig) return new ModelResult(true);
    for (let name in modelConfig) {
      if (!modelConfig.hasOwnProperty(name)) continue;
      const hasNull = isEmpty(map[name]);
      if (modelConfig[name].required && hasNull) {
        return new ModelResult(false, modelConfig[name].requiredMessage);
      }
      if (!hasNull && modelConfig[name].type === ParamsType.number && isNaN(Number(map[name]))) {
        return new ModelResult(false, modelConfig[name].typeErrorMessage);
      }
      if (!hasNull && modelConfig[name].type === ParamsType.boolean && !isBoolean(map[name])) {
        return new ModelResult(false, modelConfig[name].typeErrorMessage);
      }
      if (!hasNull && modelConfig[name].type === ParamsType.string && !isString(map[name])) {
        return new ModelResult(false, modelConfig[name].typeErrorMessage);
      } else if (modelConfig[name].stringRange) {
        const min = modelConfig[name].stringRange[0];
        const max = modelConfig[name].stringRange[1];
        if (map[name].length < min && map[name].length > max) {
          return new ModelResult(false, modelConfig[name].stringRangeMessage);
        }
      }
      if (!hasNull && modelConfig[name].type instanceof Model) {
        const model = new modelConfig[name]();
        const result: ModelResult = model.fill(map[name]);
        if (!result.valid) return result;
      }
      this[name] = map[name];
    }
    return new ModelResult(true);
  }
}

/*
 * 返回结果
 */
export class ModelResult {
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
    target.constructor[ModelConfigCache][propertyKey].description = description;
  };
}

/**
 * 添加参数提示语
 */
export function Required(message?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].required = true;
    target.constructor[ModelConfigCache][propertyKey].requiredMessage = message;
  };
}

/**
 * 添加类型错误提示语
 */
export function TypeCheck<T>(type: ParamsType | T, message?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].type = type;
    target.constructor[ModelConfigCache][propertyKey].typeErrorMessage = message;
  };
}

/**
 * 添加类型错误提示语
 */
export function StringLength<T>(range: number[], message?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].stringRange = range;
    target.constructor[ModelConfigCache][propertyKey].stringRangeMessage = message;
  };
}

/**
 * 检查参数配置是否存在
 */
function _checkParamsConfigExist(target: any, propertyKey: string) {
  if (!target.constructor[ModelConfigCache]) target.constructor[ModelConfigCache] = {};
  if (!target.constructor[ModelConfigCache][propertyKey]) target.constructor[ModelConfigCache][propertyKey] = {};
}
