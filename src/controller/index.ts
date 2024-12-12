import { copyAttrToNew, kebabCase } from '@/tools';
import { ControllerHandler, ControllerOptions, ControllerRouterFunc } from '@/controller/types';
import { DataType, MethodType } from '@/values';
import { ContextAsyncHandler, ContextBase } from '@/context/types';

export class Controller {
  /*
   * Routing prefix
   */
  public static prefix: string = '';

  /*
   * Format module or method names
   */
  public static format: boolean = true;

  /*
   * Get Route Mapping, Path is url, Handler is processor, Middleware comes from the Handler decorator
   */
  public static get: ControllerRouterFunc = () => {};

  /*
   * Post Route Mapping, Path is url, Handler is processor, Middleware comes from the Handler decorator
   */
  public static post: ControllerRouterFunc = () => {};

  /*
   * Delete Route Mapping, Path is url, Handler is processor, Middleware comes from the Handler decorator
   */
  public static delete: ControllerRouterFunc = () => {};

  /*
   * Put Route Mapping, Path is url, Handler is processor, Middleware comes from the Handler decorator
   */
  public static put: ControllerRouterFunc = () => {};

  /*
   * Apis JSON
   */
  public static apisJSON: object[] = [];

  /*
   * Init
   */
  public static init(options: ControllerOptions) {
    if (options.prefix) Controller.prefix = options.prefix;
    if (options.format) Controller.format = options.format;
    if (options.get) Controller.get = options.get;
    if (options.post) Controller.post = options.post;
    if (options.delete) Controller.delete = options.delete;
    if (options.put) Controller.put = options.put;
  }

  /*
   * Connect the controller
   * If a method in a class does not use any decorator from [Get, Post, Delete, Put], it will not be considered a Restful method
   */
  public static connect<T>(instance: T): void {
    const constructorName = 'constructor';
    const constructor = instance[constructorName];
    const connector = '/';
    const moduleName: string = constructor.name;
    const describe: string = constructor.MODULE_DESCRIBE;
    const methods: string[] = Object.getOwnPropertyNames(constructor.prototype);
    methods.forEach((name) => {
      if (name === constructorName) return;
      const handler: ControllerHandler = instance[name];
      if (!handler.METHOD) return;
      const module = Controller.format ? kebabCase(moduleName) : moduleName;
      const func = Controller.format ? kebabCase(name) : name;
      const prefix = Controller.prefix;
      const path = handler.MAPPING || prefix + connector + module + connector + func;
      if (handler.METHOD === MethodType.get) {
        Controller.get(path, handler);
      } else if (handler.METHOD === MethodType.delete) {
        Controller.delete(path, handler);
      } else if (handler.METHOD === MethodType.post) {
        Controller.post(path, handler);
      } else if (handler.METHOD === MethodType.put) {
        Controller.put(path, handler);
      }
      // 以下是接口信息
      Controller.apisJSON.push({
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
 * Declare the module and add a description
 */
export function Module(text?: string): Function {
  return function (target: Function) {
    target['MODULE_DESCRIBE'] = text;
  };
}

/*
 * Get Decorator
 */
export function Get(): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.get;
  };
}

/*
 * Delete Decorator
 */
export function Delete(): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.delete;
  };
}

/*
 * Post Decorator
 */
export function Post(): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.post;
  };
}

/*
 * Put Decorator
 */
export function Put(): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.put;
  };
}

/*
 * Declare request/response Content-Type
 */
export function Type(requestType?: DataType, responseType?: DataType): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.REQUEST_TYPE = requestType ?? DataType.json;
    descriptor.value.RESPONSE_TYPE = responseType ?? DataType.json;
  };
}

/*
 * Router Middleware
 */
export function Middleware<P1, P2 extends Function>(handler: ContextAsyncHandler): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    const next: Function = descriptor.value;
    descriptor.value = function (context: ContextBase) {
      handler.call(this, context, next.bind(this));
    };
    copyAttrToNew(descriptor.value, next);
  };
}

/*
 * Mapping Address Mapping
 */
export function Mapping(path: string): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.MAPPING = path;
  };
}

/*
 * Explain the module method
 */
export function Summary(text: string): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.SUMMARY = text;
  };
}
