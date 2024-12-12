import { copyAttrToNew } from '@/tools';
import {
  JwtOptions,
  JwtOptionsArgs,
  JwtOptionsInject,
  JwtOptionsIsResetToken,
  JwtOptionsRefuse,
  JwtOptionsSign,
  JwtOptionsVerify
} from '@/jwt/types';

/*
 * Jwt constructor
 */
export class Jwt {
  /*
   * Perform JWT signature
   */
  public static sign: JwtOptionsSign = () => null;

  /*
   * Perform JWT verification
   */
  public static verify: JwtOptionsVerify = () => null;

  /*
   * Inject payload and receive an array for handler input
   */
  public static inject: JwtOptionsInject = (args) => args;

  /*
   * Method for executing JWT verification after failure
   */
  public static refuse: JwtOptionsRefuse = () => null;

  /*
   * After successful verification, determine whether JWT signature needs to be resigned
   */
  public static isResetToken: JwtOptionsIsResetToken = () => false;

  /*
   * Initialize JWT configuration
   */
  public static init(options: JwtOptions) {
    if (options.refuse) Jwt.refuse = options.refuse;
    if (options.sign) Jwt.sign = options.sign;
    if (options.verify) Jwt.verify = options.verify;
    if (options.isResetToken) Jwt.isResetToken = options.isResetToken;
  }
}

/*
 * JWT Decorator
 * After using this decorator, JWT verification will be conducted
 */
export function Protected(): Function {
  return function (_, __, descriptor: PropertyDescriptor) {
    const func: Function = descriptor.value;
    descriptor.value = function (): any {
      const args: JwtOptionsArgs = arguments;
      const payload = Jwt.verify.call(this, args);
      if (!!payload) {
        if (Jwt.isResetToken(payload)) Jwt.sign(args, payload);
        return func.apply(this, Jwt.inject(args, payload));
      } else {
        return Jwt.refuse.call(this, args);
      }
    };
    copyAttrToNew(descriptor.value, func);
  };
}
