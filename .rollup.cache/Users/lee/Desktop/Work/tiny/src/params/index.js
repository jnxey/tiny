import { ParamsConfigCache, ParamsSource, ParamsType, StatusCode } from '@/values';
import { isBoolean, isEmpty, isString } from '@/tools';
/*
 * 参数模型
 */
export function Params(params, type) {
    return function (target, propertyKey, descriptor) {
        const func = descriptor.value;
        const _params = new params();
        descriptor.value = function () {
            const args = arguments;
            const ctx = args[0];
            const next = args[1];
            const current = type === ParamsSource.body ? ctx.request.body : ctx.query;
            const result = _params.fill(current);
            if (result.valid) {
                ctx.params = _params;
                return func.apply(this, args);
            }
            else {
                ctx.req.statusCode = StatusCode.paramsError;
                ctx.req.statusMessage = result.message;
                return next();
            }
        };
    };
}
/*
 * 参数模型
 */
export class ParamsModel {
    // 填充
    fill(map) {
        const paramsConfig = this.constructor[ParamsConfigCache];
        if (!paramsConfig)
            return new ParamsModelResult(true);
        for (let name in paramsConfig) {
            if (!paramsConfig.hasOwnProperty(name))
                continue;
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
                const result = model.fill(map[name]);
                if (!result.valid)
                    return result;
            }
            this[name] = map[name];
        }
        return new ParamsModelResult(true);
    }
}
// 默认值
ParamsModel.def = {
    number: 0,
    boolean: true,
    string: 'string'
};
/*
 * 返回结果
 */
export class ParamsModelResult {
    constructor(valid, message) {
        this.valid = false;
        this.message = '';
        this.valid = valid;
        this.message = message || '';
    }
}
/**
 * 添加参数声明，以及描述提示语
 */
export function Declare(description) {
    return function (target, propertyKey) {
        _checkParamsConfigExist(target, propertyKey);
        target.constructor[ParamsConfigCache][propertyKey].description = description;
    };
}
/**
 * 添加参数提示语
 */
export function Required(message) {
    return function (target, propertyKey) {
        _checkParamsConfigExist(target, propertyKey);
        target.constructor[ParamsConfigCache][propertyKey].required = true;
        target.constructor[ParamsConfigCache][propertyKey].requiredMessage = message;
    };
}
/**
 * 添加类型错误提示语
 */
export function TypeError(type, message) {
    return function (target, propertyKey) {
        _checkParamsConfigExist(target, propertyKey);
        target.constructor[ParamsConfigCache][propertyKey].type = type;
        target.constructor[ParamsConfigCache][propertyKey].typeErrorMessage = message;
    };
}
/**
 * 检查参数配置是否存在
 */
function _checkParamsConfigExist(target, propertyKey) {
    if (!target.constructor[ParamsConfigCache])
        target.constructor[ParamsConfigCache] = {};
    if (!target.constructor[ParamsConfigCache][propertyKey])
        target.constructor[ParamsConfigCache][propertyKey] = {};
}
