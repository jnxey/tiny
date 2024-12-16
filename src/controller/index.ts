import { copyAttrToNew, kebabCase } from '@/tools';
import { ConnectOptions, ConnectResult, ControllerHandler } from '@/controller/types';
import { DataType, MethodType } from '@/values';
import { ContextAsyncHandler, ContextBase } from '@/context/types';

export class Controller {
  /*
   * Connect the controller
   * If a method in a class does not use any decorator from [Get, Post, Delete, Put, Patch], it will not be considered a Restful method
   */
  public connect(options: ConnectOptions): ConnectResult[] {
    const constructorName = 'constructor';
    const moduleDescribeName = 'MODULE_DESCRIBE';
    const constructor = this[constructorName];
    const connector = '/';
    const moduleName: string = constructor.name;
    const describe: string = constructor[moduleDescribeName];
    const methods: string[] = Object.getOwnPropertyNames(constructor.prototype);
    const result: ConnectResult[] = [];
    methods.forEach((name) => {
      if (name === constructorName) return;
      const handler: ControllerHandler = this[name];
      if (!handler.METHOD) return;
      const module = options.format ? kebabCase(moduleName) : moduleName;
      const func = options.format ? kebabCase(name) : name;
      const prefix = options.prefix;
      const path = handler.MAPPING || prefix + connector + module + connector + func;
      result.push({
        path: path,
        method: handler.METHOD,
        handler: handler,
        options: {
          module: module,
          describe: describe,
          func: func,
          path: path,
          method: handler.METHOD,
          requestType: handler.REQUEST_TYPE ?? DataType.json,
          responseType: handler.RESPONSE_TYPE ?? DataType.json,
          summary: handler.SUMMARY,
          paramsModel: handler.PARAMS_IN_MODEL,
          resultModel: handler.PARAMS_OUT_MODEL,
          paramsInType: handler.PARAMS_IN_TYPE
        }
      });
    });
    return result;
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
 * Patch Decorator
 */
export function Patch(): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.patch;
  };
}

/*
 * Declare request/response Content-Type
 */
export function Type(requestType?: DataType, responseType?: DataType): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value.REQUEST_TYPE = requestType;
    descriptor.value.RESPONSE_TYPE = responseType;
  };
}

/*
 * Router Middleware
 */
export function Middleware<P1, P2 extends Function>(handler: ContextAsyncHandler): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    const next: Function = descriptor.value;
    descriptor.value = function (context: ContextBase) {
      handler.call(this, context, next.bind(this, context));
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
