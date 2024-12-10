import Router from '@koa/router';
import { isObject, kebabCase, syncObjectData } from '@/tools';
import { ControllerHandler, ControllerOptions, ControllerOptionsInput } from '@/controller/types';
import { DataType, MethodType } from '@/values';

export class Controller {
  public static options: ControllerOptions = {
    prefix: '',
    hump: false
  };

  public static jwtProtectedList: string[] = [];

  public static APIS_JSON: object[] = [];

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
    const describe: string = constructor.DESCRIBE;
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
      const middleware = handler.HANDLER;
      if (handler.METHOD === MethodType.get) {
        middleware ? router.get(path, middleware, handler) : router.get(path, handler);
      } else if (handler.METHOD === MethodType.delete) {
        middleware ? router.del(path, middleware, handler) : router.del(path, handler);
      } else if (handler.METHOD === MethodType.post) {
        middleware ? router.post(path, middleware, handler) : router.post(path, handler);
      } else if (handler.METHOD === MethodType.put) {
        middleware ? router.put(path, middleware, handler) : router.put(path, handler);
      }
      // 以下是接口信息
      Controller.APIS_JSON.push({
        module: module,
        describe: describe,
        func: func,
        path: path,
        method: handler.METHOD,
        requestType: handler.REQUEST_TYPE,
        responseType: handler.RESPONSE_TYPE,
        summary: handler.SUMMARY,
        paramsModel: handler.PARAMS_MODEL,
        resultModel: handler.RESULT_MODEL
      });
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
 * 声明request/response的数据类型（Content-Type）
 */
export function Type(requestType?: DataType, responseType?: DataType): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.REQUEST_TYPE = requestType ?? DataType.json;
    descriptor.value.RESPONSE_TYPE = responseType ?? DataType.json;
  };
}

/*
 * 给Router设置中间件
 */
export function Handler(handler?: Router.Middleware): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.HANDLER = handler;
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
