import { koaBody } from 'koa-body';
import jsonwebtoken from 'jsonwebtoken';

/**
 * 判断数据类型
 */
const getType = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
const isString = (value) => getType(value) === 'string';
const isObject = (value) => getType(value) === 'object';
const isBoolean = (value) => getType(value) === 'boolean';
const isEmpty = (value) => value === undefined || value === '' || value === null;
/**
 * 校验数据类型
 */
function warn(msg) {
    throw new Error(msg);
}
/**
 * 驼峰命名=>中横线命名
 */
function kebabCase(name) {
    if (!isString(name))
        warn('Name must be a string');
    const hyphenateRE = /([^-])([A-Z])/g;
    return name.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
}
/**
 *  给表单数据赋值
 */
function syncObjectData(target, remote) {
    Object.keys(target).forEach(function (name) {
        target[name] = remote[name];
    });
}

/*
 * 请求方法装饰器
 */
var MethodType;
(function (MethodType) {
    MethodType[MethodType["get"] = 0] = "get";
    MethodType[MethodType["delete"] = 1] = "delete";
    MethodType[MethodType["post"] = 2] = "post";
    MethodType[MethodType["put"] = 3] = "put";
    MethodType[MethodType["view"] = 4] = "view";
})(MethodType || (MethodType = {}));
/*
 * body的数据结构
 * json: 'application/json',
 *  text: 'text/xml',
 *  formUrlencoded: 'application/x-www-form-urlencoded',
 *  formData: 'multipart/form-data',
 *  jsonPatchJson: 'application/json-patch+json',
 *  vndApiJson: 'application/vnd.api+json',
 *  cspReport: 'application/csp-report',
 *  other: 'other'
 */
var DataType;
(function (DataType) {
    DataType[DataType["json"] = 0] = "json";
    DataType[DataType["text"] = 1] = "text";
    DataType[DataType["formUrlencoded"] = 2] = "formUrlencoded";
    DataType[DataType["formData"] = 3] = "formData";
    DataType[DataType["jsonPatchJson"] = 4] = "jsonPatchJson";
    DataType[DataType["vndApiJson"] = 5] = "vndApiJson";
    DataType[DataType["cspReport"] = 6] = "cspReport";
    DataType[DataType["other"] = 7] = "other";
})(DataType || (DataType = {}));
/*
 * 参数来源
 */
var ParamsSource;
(function (ParamsSource) {
    ParamsSource[ParamsSource["query"] = 0] = "query";
    ParamsSource[ParamsSource["body"] = 1] = "body";
})(ParamsSource || (ParamsSource = {}));
/*
 * 参数数据类型
 */
var ParamsType;
(function (ParamsType) {
    ParamsType[ParamsType["number"] = 0] = "number";
    ParamsType[ParamsType["boolean"] = 1] = "boolean";
    ParamsType[ParamsType["string"] = 2] = "string";
})(ParamsType || (ParamsType = {}));
/*
 * 缓存参数配置的键
 */
const ParamsConfigCache = 'PARAMS_CONFIG_CACHE';
/*
 * 参数数据类型
 */
const StatusCode = {
    paramsError: 400,
    authError: 408,
    serveError: 500
};

class Controller {
    static init(options) {
        if (isObject(options))
            syncObjectData(Controller.options, options);
    }
    /*
     * 连接控制器
     */
    static connect(instance, router) {
        const constructorName = 'constructor';
        const constructor = instance[constructorName];
        const connector = '/';
        const moduleName = constructor.name;
        const methods = Object.getOwnPropertyNames(constructor.prototype);
        methods.forEach((name) => {
            if (name === constructorName)
                return;
            const handler = instance[name];
            const module = Controller.options.hump ? moduleName : kebabCase(moduleName);
            const func = Controller.options.hump ? name : kebabCase(name);
            const prefix = handler.PREFIX || Controller.options.prefix;
            const mapping = handler.MAPPING || module + connector + func;
            const path = prefix + mapping;
            if (handler.JWT_PROTECTED) {
                Controller.jwtProtectedList.push(path);
            }
            const interceptor = (ctx, next) => {
                try {
                    return handler(ctx, next);
                }
                catch (err) {
                    ctx.throw(StatusCode.serveError, String(err.message));
                }
            };
            if (instance[name].METHOD === MethodType.get) {
                router.get(path, interceptor);
            }
            else if (instance[name].METHOD === MethodType.delete) {
                router.del(path, interceptor);
            }
            else if (handler.METHOD === MethodType.post) {
                if (instance[name].DATA_TYPE === DataType.other)
                    router.post(path, interceptor);
                else
                    router.post(path, koaBody(handler.DATA_TYPE_OPTIONS), interceptor);
            }
            else if (handler.METHOD === MethodType.put) {
                if (instance[name].DATA_TYPE === DataType.other)
                    router.put(path, interceptor);
                else
                    router.put(path, koaBody(handler.DATA_TYPE_OPTIONS), interceptor);
            }
            else if (instance[name].METHOD === MethodType.view) {
                router.get(path, interceptor);
            }
        });
    }
}
Controller.options = {
    prefix: '',
    hump: false
};
Controller.jwtProtectedList = [];
/*
 * Get装饰器
 */
function Get() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.get;
    };
}
/*
 * Delete装饰器
 */
function Delete() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.delete;
    };
}
/*
 * Post装饰器
 */
function Post() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.post;
    };
}
/*
 * Put装饰器
 */
function Put() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.put;
    };
}
/*
 * View装饰器
 */
function View() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.view;
    };
}
/*
 * body的数据结构为json
 */
function Json(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.json;
        descriptor.value.DATA_TYPE_OPTIONS = options || { json: true };
    };
}
/*
 * body的数据结构为文本
 */
function Text(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.text;
        descriptor.value.DATA_TYPE_OPTIONS = options || { text: true };
    };
}
/*
 * body的数据结构为FormUrlencoded
 */
function FormUrlencoded(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.formUrlencoded;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为Form表单
 */
function FormData(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.formData;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为JsonPatchJson
 */
function JsonPatchJson(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.jsonPatchJson;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为VndApiJson
 */
function VndApiJson(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.vndApiJson;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为CspReport
 */
function CspReport(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.cspReport;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为Form表单
 */
function Other() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.other;
    };
}
/*
 * 给模块方法设置单独的前缀
 */
function Prefix(text) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.PREFIX = text;
    };
}
/*
 * Mapping地址映射
 */
function Mapping(path) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.MAPPING = path;
    };
}
/*
 * 对模块方法进行说明
 */
function Summary(text) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.SUMMARY = text;
    };
}

/// Jwt构造函数
class Jwt {
    /*
     * 初始化jwt配置
     */
    static init(options) {
        if (isObject(options))
            syncObjectData(Jwt.options, options);
    }
    /*
     * 验证token
     */
    static verify(ctx) {
        const token = Jwt.options.getToken(ctx);
        if (!token)
            return null;
        try {
            return jsonwebtoken.verify(token, Jwt.options.privateKey);
        }
        catch (err) {
            return null;
        }
    }
    /*
     * 生成token
     */
    static sign(ctx, payload) {
        const token = jsonwebtoken.sign(payload, Jwt.options.privateKey, {
            algorithm: Jwt.options.algorithms,
            expiresIn: Jwt.options.expiresIn
        });
        Jwt.options.setToken(ctx, token);
        return token;
    }
}
Jwt.options = {
    privateKey: 'shared-secret',
    algorithms: 'HS256',
    expiresIn: '4h',
    ignoreExpiration: false,
    errorCode: StatusCode.authError,
    tokenKey: 'token',
    getToken: function (ctx) {
        return ctx.cookies.get(Jwt.options.tokenKey);
    },
    setToken: function (ctx, value) {
        return ctx.cookies.set(Jwt.options.tokenKey, value);
    }
};
/*
 * JWT装饰器-保护
 */
function Protected() {
    return function (target, propertyKey, descriptor) {
        const func = descriptor.value;
        descriptor.value = function () {
            const args = arguments;
            const ctx = args[0];
            const payload = Jwt.verify(ctx);
            if (payload) {
                ctx.payload = payload;
                return func.apply(this, args);
            }
            else {
                ctx.throw(Jwt.options.errorCode);
            }
        };
    };
}

/*
 * Response返回码
 */
class Dto {
    constructor({ code, result, msg }) {
        this.code = code;
        this.msg = msg;
        this.result = result;
    }
}

/*
 * 参数模型
 */
class ParamsModel {
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
class ParamsModelResult {
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
function Declare(description) {
    return function (target, propertyKey) {
        _checkParamsConfigExist(target, propertyKey);
        target.constructor[ParamsConfigCache][propertyKey].description = description;
    };
}
/**
 * 添加参数提示语
 */
function Required(message) {
    return function (target, propertyKey) {
        _checkParamsConfigExist(target, propertyKey);
        target.constructor[ParamsConfigCache][propertyKey].required = true;
        target.constructor[ParamsConfigCache][propertyKey].requiredMessage = message;
    };
}
/**
 * 添加类型错误提示语
 */
function TypeError(type, message) {
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

class Tiny {
    // 初始化
    static init(options) {
        if (options.controller)
            Controller.init(options.controller);
        if (options.jwt)
            Jwt.init(options.jwt);
    }
}

export { Controller, CspReport, Declare, Delete, Dto, FormData, FormUrlencoded, Get, Json, JsonPatchJson, Jwt, Mapping, Other, ParamsModel, ParamsModelResult, Post, Prefix, Protected, Put, Required, Summary, Text, TypeError, View, VndApiJson, Tiny as default };
