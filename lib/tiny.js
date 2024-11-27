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
        if (remote[name] !== undefined)
            target[name] = remote[name];
    });
}
/**
 *  复制方法的属性给新的方法
 */
function copyAttrToNew(fn1, fn2) {
    Object.keys(fn2).forEach(function (name) {
        fn1[name] = fn2[name];
    });
}

/*
 * 请求方法装饰器
 */
var MethodType;
(function (MethodType) {
    MethodType["get"] = "get";
    MethodType["delete"] = "delete";
    MethodType["post"] = "post";
    MethodType["put"] = "put";
    MethodType["view"] = "view";
})(MethodType || (MethodType = {}));
/*
 * body的数据结构
 * json: 'application/json',
 * text: 'text/xml',
 * formData: 'application/x-www-form-urlencoded',
 * other: 'other'
 */
var DataType;
(function (DataType) {
    DataType["json"] = "application/json";
    DataType["text"] = "text/plain";
    DataType["formUrlencoded"] = "application/x-www-form-urlencoded";
    DataType["formData"] = "multipart/form-data";
    DataType["other"] = "other";
})(DataType || (DataType = {}));
/*
 * 参数来源
 */
var ParamsSource;
(function (ParamsSource) {
    ParamsSource["query"] = "query";
    ParamsSource["body"] = "body";
})(ParamsSource || (ParamsSource = {}));
/*
 * 参数数据类型
 */
var ParamsType;
(function (ParamsType) {
    ParamsType["number"] = "number";
    ParamsType["boolean"] = "boolean";
    ParamsType["string"] = "string";
})(ParamsType || (ParamsType = {}));
/*
 * 缓存参数配置的键
 */
const ModelConfigCache = 'PARAMS_CONFIG_CACHE';
/*
 * 参数数据类型
 */
const StatusCode = {
    success: 200,
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
            const middleware = handler.DATA_TYPE_HANDLER;
            if (handler.METHOD === MethodType.get) {
                middleware ? router.get(path, middleware, handler) : router.get(path, handler);
            }
            else if (handler.METHOD === MethodType.delete) {
                middleware ? router.del(path, middleware, handler) : router.del(path, handler);
            }
            else if (handler.METHOD === MethodType.post) {
                middleware ? router.post(path, middleware, handler) : router.post(path, handler);
            }
            else if (handler.METHOD === MethodType.put) {
                middleware ? router.put(path, middleware, handler) : router.put(path, handler);
            }
            else if (handler.METHOD === MethodType.view) {
                middleware ? router.get(path, middleware, handler) : router.get(path, handler);
            }
            // 以下是接口信息
            Controller.apiInfoJson.push({
                module: module,
                func: func,
                path: path,
                method: handler.METHOD,
                dataType: handler.DATA_TYPE,
                summary: handler.SUMMARY,
                paramsModel: handler.PARAMS_MODEL,
                resultModel: handler.RESULT_MODEL
            });
        });
    }
}
Controller.options = {
    prefix: '',
    hump: false
};
Controller.jwtProtectedList = [];
Controller.apiInfoJson = [];
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
function Json(handler) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.json;
        descriptor.value.DATA_TYPE_HANDLER = handler;
    };
}
/*
 * body的数据结构为文本
 */
function Text(handler) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.text;
        descriptor.value.DATA_TYPE_HANDLER = handler;
    };
}
/*
 * body的数据结构为FormUrlencoded
 */
function FormUrlencoded(handler) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.text;
        descriptor.value.DATA_TYPE_HANDLER = handler;
    };
}
/*
 * body的数据结构为Form表单
 */
function FormData(handler) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.text;
        descriptor.value.DATA_TYPE_HANDLER = handler;
    };
}
/*
 * body的数据结构为other
 */
function Other(handler) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.other;
        descriptor.value.DATA_TYPE_HANDLER = handler;
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
 * ctx额外参数设置
 */
class DtoCtxExtend {
    constructor({ params, payload }) {
        if (!!params)
            this.setParams(params);
        if (!!payload)
            this.setPayload(payload);
    }
    setParams(params) {
        this.params = params;
    }
    setPayload(payload) {
        this.payload = payload;
    }
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
            return Jwt.options.jsonwebtoken.verify(token, Jwt.options.privateKey);
        }
        catch (err) {
            return null;
        }
    }
    /*
     * 生成token
     */
    static sign(ctx, payload) {
        if (isObject(payload)) {
            delete payload['iat'];
            delete payload['exp'];
        }
        const token = Jwt.options.jsonwebtoken.sign(Object.assign({}, payload), Jwt.options.privateKey, {
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
    expiresIn: '24h',
    ignoreExpiration: false,
    errorCode: StatusCode.authError,
    errorMsg: 'Unauthorized access',
    tokenKey: 'token',
    jsonwebtoken: { verify: () => { }, sign: () => { } },
    getToken: function (ctx) {
        return ctx.cookies.get(Jwt.options.tokenKey);
    },
    setToken: function (ctx, value) {
        return ctx.cookies.set(Jwt.options.tokenKey, value);
    },
    isResetToken: () => false
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
            const next = args[1];
            const payload = Jwt.verify(ctx);
            if (payload) {
                if (Jwt.options.isResetToken(ctx)) {
                    Jwt.sign(ctx, payload);
                }
                const extend = new DtoCtxExtend(Object.assign(Object.assign({}, (args[2] || {})), { payload: payload }));
                return func.call(this, ctx, next, extend);
            }
            else {
                ctx.body = new Dto({ code: Jwt.options.errorCode, msg: Jwt.options.errorMsg });
                return next();
            }
        };
        copyAttrToNew(descriptor.value, func);
    };
}

/*
 * 参数模型
 */
function Params(params, type, validate = true, handler) {
    return function (target, propertyKey, descriptor) {
        const func = descriptor.value;
        const _params = new params();
        descriptor.value.PARAMS_MODEL = _params.getConfigCache();
        if (!validate)
            return;
        descriptor.value = function () {
            var _a;
            const args = arguments;
            const ctx = args[0];
            const next = args[1];
            const payload = (_a = args[2]) === null || _a === void 0 ? void 0 : _a.payload;
            const current = type === ParamsSource.body ? ctx.request.body : ctx.query;
            const result = _params.fill(!!handler ? handler(current !== null && current !== void 0 ? current : {}, payload) : current !== null && current !== void 0 ? current : {});
            if (result.valid) {
                const extend = new DtoCtxExtend(Object.assign(Object.assign({}, (args[2] || {})), { params: _params }));
                return func.call(this, ctx, next, extend);
            }
            else {
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
function Result(result) {
    return function (target, propertyKey, descriptor) {
        const _result = new result();
        descriptor.value.RESULT_MODEL = _result.getConfigCache();
    };
}

/*
 * 参数模型
 */
class Model {
    // 获取config
    getConfigCache() {
        return this.constructor[ModelConfigCache];
    }
    // 填充
    fill(map) {
        const modelConfig = this.constructor[ModelConfigCache];
        if (!modelConfig)
            return new ModelResult(true);
        for (let name in modelConfig) {
            if (!modelConfig.hasOwnProperty(name))
                continue;
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
            }
            else if (modelConfig[name].stringRange) {
                const min = modelConfig[name].stringRange[0];
                const max = modelConfig[name].stringRange[1];
                if (map[name].length < min && map[name].length > max) {
                    return new ModelResult(false, modelConfig[name].stringRangeMessage);
                }
            }
            if (!hasNull && modelConfig[name].type instanceof Model) {
                const model = new modelConfig[name]();
                const result = model.fill(map[name]);
                if (!result.valid)
                    return result;
            }
            this[name] = map[name];
        }
        return new ModelResult(true);
    }
}
// 默认值
Model.def = {
    number: 0,
    boolean: true,
    string: '',
    null: null
};
/*
 * 返回结果
 */
class ModelResult {
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
        target.constructor[ModelConfigCache][propertyKey].description = description;
    };
}
/**
 * 添加参数提示语
 */
function Required(message) {
    return function (target, propertyKey) {
        _checkParamsConfigExist(target, propertyKey);
        target.constructor[ModelConfigCache][propertyKey].required = true;
        target.constructor[ModelConfigCache][propertyKey].requiredMessage = message;
    };
}
/**
 * 添加类型错误提示语
 */
function TypeCheck(type, message) {
    return function (target, propertyKey) {
        _checkParamsConfigExist(target, propertyKey);
        target.constructor[ModelConfigCache][propertyKey].type = type;
        target.constructor[ModelConfigCache][propertyKey].typeErrorMessage = message;
    };
}
/**
 * 添加类型错误提示语
 */
function StringLength(range, message) {
    return function (target, propertyKey) {
        _checkParamsConfigExist(target, propertyKey);
        target.constructor[ModelConfigCache][propertyKey].stringRange = range;
        target.constructor[ModelConfigCache][propertyKey].stringRangeMessage = message;
    };
}
/**
 * 检查参数配置是否存在
 */
function _checkParamsConfigExist(target, propertyKey) {
    if (!target.constructor[ModelConfigCache])
        target.constructor[ModelConfigCache] = {};
    if (!target.constructor[ModelConfigCache][propertyKey])
        target.constructor[ModelConfigCache][propertyKey] = {};
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

export { Controller, DataType, Declare, Delete, Dto, DtoCtxExtend, FormData, FormUrlencoded, Get, Json, Jwt, Mapping, MethodType, Model, ModelConfigCache, ModelResult, Other, Params, ParamsSource, ParamsType, Post, Prefix, Protected, Put, Required, Result, StatusCode, StringLength, Summary, Text, TypeCheck, View, Tiny as default };
