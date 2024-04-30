import Router from '@koa/router';
import { koaBody } from 'koa-body';
import { ExtendableContext, Next } from 'koa';
import { isObject, isString, kebabCase, syncObjectData } from '@/tools';
import { ControllerHandler, ControllerOptions, ControllerOptionsInput } from '@/types/controller';
import { DataType, Method } from '@/controller/decorator';

export class Controller {
  public static options: ControllerOptions = {
    prefix: ''
  };

  public static jwtProtectedList = [];

  public static init(options: ControllerOptionsInput) {
    if (isObject(options)) syncObjectData(Controller.options, options);
  }

  /*
   * 连接控制器
   */
  public static connect<T>(instance: T, router: Router): void {
    const constructorName = 'constructor';
    const connector = '/';
    const moduleName: string = instance.constructor.name;
    const methods: string[] = Object.getOwnPropertyNames(instance.constructor.prototype);
    methods.forEach((name) => {
      if (name === constructorName) return;
      const handler: ControllerHandler = instance[name];
      const prefix = isString(handler.PREFIX) ? handler.PREFIX : Controller.options.prefix;
      const module = kebabCase(moduleName);
      const func = kebabCase(name);
      const mapping = isString(handler.MAPPING) ? handler.MAPPING : module + connector + func;
      const path = prefix + mapping;
      if (handler.JWT_PROTECTED) {
        Controller.jwtProtectedList.push(path);
      }
      const interceptor: Router.Middleware = (ctx: ExtendableContext, next: Next) => {
        try {
          return handler(ctx, next);
        } catch (err: Error | any) {
          /// ToDo: 收集错误信息
          if (err instanceof Error) console.log(err.stack?.toString(), 'err-----------1');
        }
      };
      if (instance[name].METHOD === Method.Type.get) {
        router.get(path, interceptor);
      } else if (instance[name].METHOD === Method.Type.delete) {
        router.delete(path, interceptor);
      } else if (handler.METHOD === Method.Type.post) {
        if (instance[name].DATA_TYPE === DataType.Type.other) {
          router.post(path, interceptor);
        } else {
          router.post(path, koaBody(handler.DATA_TYPE_OPTIOINS), interceptor);
        }
      } else if (handler.METHOD === Method.Type.put) {
        if (instance[name].DATA_TYPE === DataType.Type.other) {
          router.put(path, interceptor);
        } else {
          router.put(path, koaBody(handler.DATA_TYPE_OPTIOINS), interceptor);
        }
      } else if (instance[name].METHOD === Method.View) {
        router.get(path, interceptor);
      }
    });
  }
}
