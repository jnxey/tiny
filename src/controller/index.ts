import Router from '@koa/router';
import { koaBody } from 'koa-body';
import { ExtendableContext, Next } from 'koa';
import { isObject, kebabCase, syncObjectData } from '@/tools';
import { ControllerHandler, ControllerOptions, ControllerOptionsInput } from '@/controller/types';
import { MethodType, DataType, StatusCode } from '@/values';
import { KoaBodyMiddlewareOptions } from 'koa-body/lib/types';

export class Controller {
  public static options: ControllerOptions = {
    prefix: '',
    hump: false
  };

  public static jwtProtectedList: string[] = [];

  public static init(options: ControllerOptionsInput) {
    if (isObject(options)) syncObjectData(Controller.options, options);
  }

  /*
   * 连接控制器
   */
  public static connect<T>(instance: T, router: Router): void {
    const constructorName = 'constructor';
    const constructor = instance[constructorName];
    const connector = '/';
    const moduleName: string = constructor.name;
    const methods: string[] = Object.getOwnPropertyNames(constructor.prototype);
    methods.forEach((name) => {
      if (name === constructorName) return;
      const handler: ControllerHandler = instance[name];
      const module = Controller.options.hump ? moduleName : kebabCase(moduleName);
      const func = Controller.options.hump ? name : kebabCase(name);
      const prefix = handler.PREFIX || Controller.options.prefix;
      const mapping = handler.MAPPING || module + connector + func;
      const path = prefix + mapping;
      if (handler.JWT_PROTECTED) {
        Controller.jwtProtectedList.push(path);
      }
      const interceptor: Router.Middleware = (ctx: ExtendableContext, next: Next) => {
        try {
          return handler(ctx, next);
        } catch (err: Error | any) {
          ctx.throw(StatusCode.serveError, String(err.message));
        }
      };
      if (instance[name].METHOD === MethodType.get) {
        router.get(path, interceptor);
      } else if (instance[name].METHOD === MethodType.delete) {
        router.del(path, interceptor);
      } else if (handler.METHOD === MethodType.post) {
        if (instance[name].DATA_TYPE === DataType.other) router.post(path, interceptor);
        else router.post(path, koaBody(handler.DATA_TYPE_OPTIONS), interceptor);
      } else if (handler.METHOD === MethodType.put) {
        if (instance[name].DATA_TYPE === DataType.other) router.put(path, interceptor);
        else router.put(path, koaBody(handler.DATA_TYPE_OPTIONS), interceptor);
      } else if (instance[name].METHOD === MethodType.view) {
        router.get(path, interceptor);
      }
    });
  }
}

/*
 * Get装饰器
 */
export function Get(): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.get;
  };
}

/*
 * Delete装饰器
 */
export function Delete(): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.delete;
  };
}

/*
 * Post装饰器
 */
export function Post(): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.post;
  };
}

/*
 * Put装饰器
 */
export function Put(): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.put;
  };
}

/*
 * View装饰器
 */
export function View(): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.view;
  };
}

/*
 * body的数据结构为json
 */
export function Json(options?: Partial<KoaBodyMiddlewareOptions>): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.json;
    descriptor.value.DATA_TYPE_OPTIONS = options || { json: true };
  };
}

/*
 * body的数据结构为文本
 */
export function Text(options?: Partial<KoaBodyMiddlewareOptions>): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.text;
    descriptor.value.DATA_TYPE_OPTIONS = options || { text: true };
  };
}

/*
 * body的数据结构为FormUrlencoded
 */
export function FormUrlencoded(options?: Partial<KoaBodyMiddlewareOptions>): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.formUrlencoded;
    descriptor.value.DATA_TYPE_OPTIONS = options;
  };
}

/*
 * body的数据结构为Form表单
 */
export function FormData(options?: Partial<KoaBodyMiddlewareOptions>): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.formData;
    descriptor.value.DATA_TYPE_OPTIONS = options;
  };
}

/*
 * body的数据结构为JsonPatchJson
 */
export function JsonPatchJson(options?: Partial<KoaBodyMiddlewareOptions>): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.jsonPatchJson;
    descriptor.value.DATA_TYPE_OPTIONS = options;
  };
}

/*
 * body的数据结构为VndApiJson
 */
export function VndApiJson(options?: Partial<KoaBodyMiddlewareOptions>): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.vndApiJson;
    descriptor.value.DATA_TYPE_OPTIONS = options;
  };
}

/*
 * body的数据结构为CspReport
 */
export function CspReport(options?: Partial<KoaBodyMiddlewareOptions>): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.cspReport;
    descriptor.value.DATA_TYPE_OPTIONS = options;
  };
}

/*
 * body的数据结构为Form表单
 */
export function Other(): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.other;
  };
}

/*
 * 给模块方法设置单独的前缀
 */
export function Prefix(text: string): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.PREFIX = text;
  };
}

/*
 * Mapping地址映射
 */
export function Mapping(path: string): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.MAPPING = path;
  };
}

/*
 * 对模块方法进行说明
 */
export function Summary(text: string): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.SUMMARY = text;
  };
}
