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
    context.send(new Dto(null, StatusCode.authError, JwtVerifyRefuse));
  };
}

/*
 * JWT Decorator
 * After using this decorator, JWT verification will be conducted
 */
export function Protected(perms?: string | string[]): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    const next: Function = descriptor.value;
    descriptor.value = function (context: ContextBase) {
      context.setPerms(perms);
      asyncError(Jwt.verify.call(this, context, next.bind(this, context)), context.error);
    };
    copyAttrToNew(descriptor.value, next);
  };
}
