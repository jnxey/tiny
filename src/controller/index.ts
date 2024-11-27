import Router from '@koa/router';
import { isObject, kebabCase, syncObjectData } from '@/tools';
import { ControllerHandler, ControllerOptions, ControllerOptionsInput } from '@/controller/types';
import { MethodType, DataType } from '@/values';

export class Controller {
  public static options: ControllerOptions = {
    prefix: '',
    hump: false
  };

  public static jwtProtectedList: string[] = [];

  public static apiInfoJson: object[] = [];

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
      const middleware = handler.DATA_TYPE_HANDLER;
      if (handler.METHOD === MethodType.get) {
        middleware ? router.get(path, middleware, handler) : router.get(path, handler);
      } else if (handler.METHOD === MethodType.delete) {
        middleware ? router.del(path, middleware, handler) : router.del(path, handler);
      } else if (handler.METHOD === MethodType.post) {
        middleware ? router.post(path, middleware, handler) : router.post(path, handler);
      } else if (handler.METHOD === MethodType.put) {
        middleware ? router.put(path, middleware, handler) : router.put(path, handler);
      } else if (handler.METHOD === MethodType.view) {
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
export function Json(handler?: Router.Middleware): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.json;
    descriptor.value.DATA_TYPE_HANDLER = handler;
  };
}

/*
 * body的数据结构为文本
 */
export function Text(handler?: Router.Middleware): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.text;
    descriptor.value.DATA_TYPE_HANDLER = handler;
  };
}

/*
 * body的数据结构为FormUrlencoded
 */
export function FormUrlencoded(handler?: Router.Middleware): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.text;
    descriptor.value.DATA_TYPE_HANDLER = handler;
  };
}

/*
 * body的数据结构为Form表单
 */
export function FormData(handler?: Router.Middleware): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.text;
    descriptor.value.DATA_TYPE_HANDLER = handler;
  };
}

/*
 * body的数据结构为other
 */
export function Other(handler?: Router.Middleware): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.DATA_TYPE = DataType.other;
    descriptor.value.DATA_TYPE_HANDLER = handler;
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
