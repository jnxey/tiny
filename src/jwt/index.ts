import { isObject, syncObjectData } from '@/tools';
import jwt from 'koa-jwt';
import { JwtOptions, JwtOptionsInput } from '@/types/jwt';
import { ExtendableContext } from 'koa';
import { Controller } from '@/controller';

/// Jwt构造函数
export class Jwt {
  public static options: JwtOptions = {
    privateKey: 'shared-secret',
    algorithms: ['HS256'],
    tokenKey: 'Auth-Token',
    expiresIn: '2h'
  };

  public static init(options: JwtOptionsInput) {
    if (isObject(options)) syncObjectData(Jwt.options, options);
  }

  /*
   * JWT装饰器-保护
   */
  public static intercept() {
    return jwt({
      secret: Jwt.options.privateKey,
      algorithms: Jwt.options.algorithms,
      getToken(ctx: ExtendableContext): string | null {
        return ctx.cookies.get(Jwt.options.tokenKey) || null;
      }
    }).unless({
      custom: function (ctx: ExtendableContext) {
        let result = true;
        const url: string = ctx.originalUrl || '';
        const protectedList = Controller.jwtProtectedList;
        for (let i = 0; i < protectedList.length; i++) {
          const path = protectedList[i];
          if (url.startsWith(path)) {
            result = false;
            break;
          }
        }
        return result;
      }
    });
  }

  /*
   * JWT装饰器-保护
   */
  public static protected(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.JWT_PROTECTED = true;
    };
  }
}
