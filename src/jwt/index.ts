import { copyAttrToNew } from '@/tools';
import { JwtOptions, JwtSign, JwtVerify } from '@/jwt/types';
import { ContextBase } from '@/context/types';
import { StatusCode } from '@/values';
import { Dto } from '@/dto';

/*
 * Jwt constructor
 */
export class Jwt {
  /*
   * Perform JWT signature
   */
  public static sign: JwtSign = () => null;

  /*
   * Perform JWT verification
   */
  public static verify: JwtVerify = () => null;

  /*
   * Perform JWT verification refuse
   */
  static refuse = (context: ContextBase) => {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.authError, msg: 'No permission to access temporarily', result: null }));
  };

  /*
   * Initialize JWT configuration
   */
  public static init(options: JwtOptions) {
    if (options.sign) Jwt.sign = options.sign;
    if (options.verify) Jwt.verify = options.verify;
  }
}

/*
 * JWT Decorator
 * After using this decorator, JWT verification will be conducted
 */
export function Protected(): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    const next: Function = descriptor.value;
    descriptor.value = function (context: ContextBase) {
      Jwt.verify.call(this, context, next.bind(this, context));
    };
    copyAttrToNew(descriptor.value, next);
  };
}
