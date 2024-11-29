import { ModelConfigCache, ParamsType } from '@/values';
import { isArray, isBoolean, isDate, isEmpty, isString } from '@/tools';

/*
 * 参数模型
 */
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

  // 检查类型方法
  public static checkType(config, value): ModelResult {
    const hasNull = isEmpty(value);
    if (config.required && hasNull) {
      return new ModelResult(false, config.requiredMessage);
    }
    if (!hasNull && config.type === ParamsType.array) {
      if (!isArray(value)) return new ModelResult(false, config.typeErrorMessage);
      if (value.length > config.arrayMaxLength) return new ModelResult(false, 'Array exceeds limit');
      const array: any[] = [];
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const _result = Model.checkType({ type: config.arrayType, typeErrorMessage: config.arrayTypeErrorMessage }, item);
        if (_result?.valid) {
          array.push(_result.value);
        } else {
          return _result;
        }
      }
      value = array;
    }
    if (!hasNull && config.type === ParamsType.number && isNaN(parseFloat(value))) {
      return new ModelResult(false, config.typeErrorMessage);
    } else if (!hasNull && config.type === ParamsType.number) {
      value = parseFloat(value); // 数字为 字符串数字 时，做处理
    }
    if (!hasNull && config.type === ParamsType.boolean && !isBoolean(value)) {
      return new ModelResult(false, config.typeErrorMessage);
    }
    if (!hasNull && config.type === ParamsType.string && isDate(value)) {
      value = String(value); // 日期类型 先转 字符串
    }
    if (!hasNull && config.type === ParamsType.string && !isString(value)) {
      return new ModelResult(false, config.typeErrorMessage);
    } else if (config.stringRange) {
      const min = config.stringRange[0];
      const max = config.stringRange[1];
      if (value.length < min && value.length > max) {
        return new ModelResult(false, config.stringRangeMessage);
      }
    }
    if (!hasNull && Model.prototype.isPrototypeOf(config.type?.prototype)) {
      const model = new config.type();
      const result: ModelResult = model.fill(value);
      if (result.valid) {
        value = result.value;
      } else {
        return result;
      }
    }
    return new ModelResult(true, '', value);
  }

  // 填充
  public fill<T>(map: object) {
    const modelConfig = this.constructor[ModelConfigCache];
    if (!modelConfig) return new ModelResult(true);
    for (let name in modelConfig) {
      if (!modelConfig.hasOwnProperty(name)) continue;
      const config = modelConfig[name];
      const result = Model.checkType(config, map[name]);
      if (!result?.valid) return result;
      this[name] = result.value;
    }
    return new ModelResult(true, '', this);
  }
}

/*
 * 返回结果
 */
export class ModelResult {
  public valid: boolean = false;
  public message: string = '';
  public value?: any = {};

  constructor(valid: boolean, message?: string, value?: any) {
    this.valid = valid;
    this.message = message || '';
    this.value = value;
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
 * 设置此字段为数组类型
 */
export function ArrayCheck<T>(type: ParamsType | T, message?: string, maxLength?: number): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].arrayType = type;
    target.constructor[ModelConfigCache][propertyKey].arrayTypeErrorMessage = message;
    target.constructor[ModelConfigCache][propertyKey].arrayMaxLength = maxLength ?? 1000;
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
