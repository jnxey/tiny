import { ModelConfigCache, ParamsType } from '@/values';
import { deepClone, isArray, isBoolean, isDate, isEmpty, isObject, isString } from '@/tools';
import { ModelConfig } from '@/model/types';

/*
 * Data Model
 */
export class Model {
  /*
   * Define initial default values
   */
  public static def = { number: 0, boolean: true, string: '', null: null };

  /*
   * Check type method
   */
  public static checkType(config: ModelConfig, value): ModelResult {
    const hasNull = isEmpty(value);
    if (config.required && hasNull) return new ModelResult(false, config.requiredMessage);
    if (!hasNull && config.type === ParamsType.array) {
      if (!isArray(value)) return new ModelResult(false, config.typeErrorMessage);
      if (value.length > (config.arrayMaxLength ?? 0)) return new ModelResult(false, config.arrayMaxLengthMessage);
      const array: any[] = [];
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const _result = Model.checkType({ type: config.arrayType, typeErrorMessage: config.arrayTypeErrorMessage }, item);
        if (!_result?.valid) return _result;
        array.push(_result.value);
      }
      value = array;
    }
    // number
    if (!hasNull && config.type === ParamsType.number) {
      value = Number(value); // When the number is a string number, perform processing
      if (isNaN(value)) return new ModelResult(false, config.typeErrorMessage);
    }
    // boolean
    if (!hasNull && config.type === ParamsType.boolean && !isBoolean(value)) {
      return new ModelResult(false, config.typeErrorMessage);
    }
    // string
    if (!hasNull && config.type === ParamsType.string) {
      if (isDate(value)) value = String(value); // Date type converted to string first
      if (!isString(value)) return new ModelResult(false, config.typeErrorMessage);
      if (config.stringRange) {
        // string range
        const min = config.stringRange[0];
        const max = config.stringRange[1];
        if (value.length < min || value.length > max) {
          return new ModelResult(false, config.stringRangeMessage);
        }
      }
    }
    // Model Constructor
    if (!hasNull && typeof config.type === 'function' && Model.prototype.isPrototypeOf(config.type?.prototype)) {
      const model = new config.type();
      const result = model.fill(value);
      if (!result.valid) return result;
      value = result.value;
    }
    // custom
    if (!hasNull && typeof config.typeCustom === 'function') {
      const result = config.typeCustom(value);
      if (!result.valid) return result;
      value = result.value;
    }

    return new ModelResult(true, 'success', value);
  }

  /*
   * Get the current data model configuration
   */
  public getConfigCache() {
    return this.constructor[ModelConfigCache];
  }

  // Fill in data based on type
  public fill<T = object>(map: T): ModelResult {
    if (!isObject(map)) return new ModelResult(false, 'fail');
    const modelConfig = this.constructor[ModelConfigCache];
    if (!modelConfig) return new ModelResult(true);
    for (let name in modelConfig) {
      if (!modelConfig.hasOwnProperty(name)) continue;
      const config = modelConfig[name];
      const result = Model.checkType(config, map[name]);
      if (!result?.valid) return result;
      this[name] = result.value;
    }
    return new ModelResult(true, 'success', this);
  }
}

/*
 * Model verification or filling returns results
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
 * Add attribute declarations and descriptive prompts
 */
export function Declare(description?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].description = description;
  };
}

/**
 * Setting attribute cannot be empty (nul, undefined, '')
 */
export function Required(message?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].required = true;
    target.constructor[ModelConfigCache][propertyKey].requiredMessage = message;
  };
}

/**
 * Set attribute type
 */
export function TypeCheck<T>(type: ParamsType | T, message?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].type = type;
    target.constructor[ModelConfigCache][propertyKey].typeErrorMessage = message;
  };
}

/**
 * When the `type` in `TypeCheck` is `ParamsType.array`, this decorator can be set to verify the type of array content
 */
export function ArrayCheck<T>(type: ParamsType | T, message?: string, maxLength?: number, maxLengthMessage?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].arrayType = type;
    target.constructor[ModelConfigCache][propertyKey].arrayTypeErrorMessage = message;
    target.constructor[ModelConfigCache][propertyKey].arrayMaxLength = maxLength ?? 1000;
    target.constructor[ModelConfigCache][propertyKey].arrayMaxLengthMessage = maxLengthMessage ?? 'Array exceeds limit';
  };
}

/**
 * When the `type in `TypeCheck` is `ParamsType.string`, this decorator can be set to check the length of the string
 */
export function StringLength<T>(range: number[], message?: string): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].stringRange = range;
    target.constructor[ModelConfigCache][propertyKey].stringRangeMessage = message;
  };
}

/**
 * Set custom verification method
 */
export function TypeCustom<T>(valid: (value: T) => ModelResult): Function {
  return function (target: any, propertyKey: string) {
    _checkParamsConfigExist(target, propertyKey);
    target.constructor[ModelConfigCache][propertyKey].typeCustom = valid;
  };
}

/**
 * Check if the attribute configuration exists
 */
function _checkParamsConfigExist(target: any, propertyKey: string) {
  if (!target.constructor.hasOwnProperty(ModelConfigCache))
    target.constructor[ModelConfigCache] = deepClone(target.constructor[ModelConfigCache] ?? {});
  if (!target.constructor[ModelConfigCache][propertyKey]) target.constructor[ModelConfigCache][propertyKey] = {};
}
