import { koaBody } from 'koa-body';
import { isObject, kebabCase, syncObjectData } from '@/tools';
import { MethodType, DataType } from '@/values';
export class Controller {
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
                var _a;
                try {
                    return handler(ctx, next);
                }
                catch (err) {
                    /// ToDo: 收集错误信息
                    if (err instanceof Error)
                        console.log((_a = err.stack) === null || _a === void 0 ? void 0 : _a.toString(), 'err-----------1');
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
export function Get() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.get;
    };
}
/*
 * Delete装饰器
 */
export function Delete() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.delete;
    };
}
/*
 * Post装饰器
 */
export function Post() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.post;
    };
}
/*
 * Put装饰器
 */
export function Put() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.put;
    };
}
/*
 * View装饰器
 */
export function View() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.METHOD = MethodType.view;
    };
}
/*
 * body的数据结构为json
 */
export function Json(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.json;
        descriptor.value.DATA_TYPE_OPTIONS = options || { json: true };
    };
}
/*
 * body的数据结构为文本
 */
export function Text(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.text;
        descriptor.value.DATA_TYPE_OPTIONS = options || { text: true };
    };
}
/*
 * body的数据结构为FormUrlencoded
 */
export function FormUrlencoded(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.formUrlencoded;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为Form表单
 */
export function FormData(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.formData;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为JsonPatchJson
 */
export function JsonPatchJson(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.jsonPatchJson;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为VndApiJson
 */
export function VndApiJson(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.vndApiJson;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为CspReport
 */
export function CspReport(options) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.cspReport;
        descriptor.value.DATA_TYPE_OPTIONS = options;
    };
}
/*
 * body的数据结构为Form表单
 */
export function Other() {
    return function (target, propertyKey, descriptor) {
        descriptor.value.DATA_TYPE = DataType.other;
    };
}
/*
 * 给模块方法设置单独的前缀
 */
export function Prefix(text) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.PREFIX = text;
    };
}
/*
 * Mapping地址映射
 */
export function Mapping(path) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.MAPPING = path;
    };
}
/*
 * 对模块方法进行说明
 */
export function Summary(text) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.SUMMARY = text;
    };
}
