import { asyncError, copyAttrToNew } from '@/tools';
import { JwtRefuse, JwtSign, JwtVerify } from '@/jwt/types';
import { ContextBase } from '@/context/types';
import { JwtVerifyRefuse, StatusCode } from '@/values';
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
  public static refuse: JwtRefuse = (context: ContextBase) => {
    context.send(StatusCode.success, new Dto({ code: StatusCode.authError, msg: JwtVerifyRefuse, result: null }));
  };
}

/*
 * JWT Decorator
 * After using this decorator, JWT verification will be conducted
 */
export function Protected(): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    const next: Function = descriptor.value;
    descriptor.value = function (context: ContextBase) {
      asyncError(Jwt.verify.call(this, context, next.bind(this, context)), context.error);
    };
    copyAttrToNew(descriptor.value, next);
  };
}
