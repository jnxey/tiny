import { isObject, kebabCase, syncObjectData } from '@/tools';
import { ControllerOptions, ControllerOptionsInput } from '@/controller/types';
import { MethodType } from '@/values';
import { Express, RequestHandler } from 'express';

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
  public static connect<T>(instance: T, app: Express): void {
    const constructorName = 'constructor';
    const constructor = instance[constructorName];
    const connector = '/';
    const moduleName: string = constructor.name;
    const methods: string[] = Object.getOwnPropertyNames(constructor.prototype);
    methods.forEach((name) => {
      if (name === constructorName) return;
      const handler: RequestHandler = instance[name];
      const module = Controller.options.hump ? moduleName : kebabCase(moduleName);
      const func = Controller.options.hump ? name : kebabCase(name);
      const prefix = handler.PREFIX || Controller.options.prefix;
      const mapping = handler.MAPPING || module + connector + func;
      const path = prefix + mapping;
      if (handler.JWT_PROTECTED) {
        Controller.jwtProtectedList.push(path);
      }
      if (instance[name].METHOD === MethodType.get) {
        app.get(path, handler);
      } else if (instance[name].METHOD === MethodType.delete) {
        app.delete(path, handler);
      } else if (handler.METHOD === MethodType.post) {
        app.post(path, handler);
      } else if (handler.METHOD === MethodType.put) {
        app.put(path, handler);
      } else if (handler.METHOD === MethodType.param) {
        app.param(path, handler);
      } else if (instance[name].METHOD === MethodType.view) {
        app.get(path, handler);
      }
    });
  }
}

/*
 * Get装饰器
 */
export function Get(): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.get;
  };
}

/*
 * Delete装饰器
 */
export function Delete(): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.delete;
  };
}

/*
 * Post装饰器
 */
export function Post(): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.post;
  };
}

/*
 * Put装饰器
 */
export function Put(): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.put;
  };
}

/*
 * Param装饰器
 */
export function Param(): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.param;
  };
}

/*
 * View装饰器
 */
export function View(): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.METHOD = MethodType.view;
  };
}

/*
 * 给模块方法设置单独的前缀
 */
export function Prefix(text: string): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.PREFIX = text;
  };
}

/*
 * Mapping地址映射
 */
export function Mapping(path: string): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.MAPPING = path;
  };
}

/*
 * 对模块方法进行说明
 */
export function Summary(text: string): Function {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.SUMMARY = text;
  };
}
