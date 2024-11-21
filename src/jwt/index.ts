import { copyAttrToNew, isObject, syncObjectData } from '@/tools';
import jsonwebtoken from 'jsonwebtoken';
import { JwtOptions, JwtOptionsInput } from '@/jwt/types';
import { ExtendableContext } from 'koa';
import { StatusCode } from '@/values';

/// Jwt构造函数
export class Jwt {
  public static options: JwtOptions = {
    privateKey: 'shared-secret',
    algorithms: 'HS256',
    expiresIn: '24h',
    ignoreExpiration: false,
    errorCode: StatusCode.authError,
    tokenKey: 'token',
    getToken: function (ctx: ExtendableContext) {
      return ctx.cookies.get(Jwt.options.tokenKey);
    },
    setToken: function (ctx: ExtendableContext, value: string) {
      return ctx.cookies.set(Jwt.options.tokenKey, value);
    },
    isResetToken: () => false
  };

  /*
   * 初始化jwt配置
   */
  public static init(options: JwtOptionsInput) {
    if (isObject(options)) syncObjectData(Jwt.options, options);
  }

  /*
   * 验证token
   */
  public static verify<T>(ctx: ExtendableContext): T | null {
    const token = Jwt.options.getToken(ctx);
    if (!token) return null;
    try {
      return jsonwebtoken.verify(token, Jwt.options.privateKey);
    } catch (err) {
      return null;
    }
  }

  /*
   * 生成token
   */
  public static sign<T>(ctx: ExtendableContext, payload: T): string {
    const token = jsonwebtoken.sign(payload, Jwt.options.privateKey, {
      algorithm: Jwt.options.algorithms,
      expiresIn: Jwt.options.expiresIn
    });
    Jwt.options.setToken(ctx, token);
    return token;
  }
}

/*
 * JWT装饰器-保护
 */
export function Protected(): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const func: Function = descriptor.value;
    descriptor.value = function (): any {
      const args = arguments;
      const ctx: ExtendableContext = args[0];
      const payload = Jwt.verify(ctx);
      if (payload) {
        ctx.payload = payload;
        if (Jwt.options.isResetToken(ctx)) {
          Jwt.sign(ctx, payload);
        }
        return func.apply(this, args);
      } else {
        ctx.throw(Jwt.options.errorCode);
      }
    };
    copyAttrToNew(descriptor.value, func);
  };
}
