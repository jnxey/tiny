import { copyAttrToNew } from '@/tools';
import { JwtOptions, JwtOptionsContext, JwtOptionsIsResetToken, JwtOptionsRefuse, JwtOptionsSign, JwtOptionsVerify } from '@/jwt/types';

/*
 * Jwt constructor
 */
export class Jwt {
  /*
   * Obtain the context required for JWT through the parameters of the handler
   */
  public static context: JwtOptionsContext = (args) => args;

  /*
   * Method for executing JWT verification after failure
   */
  public static refuse: JwtOptionsRefuse = (args) => args;

  /*
   * Perform JWT signature
   */
  public static sign: JwtOptionsSign = () => null;

  /*
   * Perform JWT verification
   */
  public static verify: JwtOptionsVerify = () => null;

  /*
   * After successful verification, determine whether JWT signature needs to be re signed
   */
  public static isResetToken: JwtOptionsIsResetToken = () => false;

  /*
   * Initialize JWT configuration
   */
  public static init(options: JwtOptions) {
    if (options.context) Jwt.context = options.context;
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
      const args = arguments;
      const context = Jwt.context(args);
      const payload = Jwt.verify(context);
      if (!!payload) {
        if (Jwt.isResetToken(payload)) Jwt.sign(context, payload);
        return func.call(this, args);
      } else {
        return Jwt.refuse(args);
      }
    };
    copyAttrToNew(descriptor.value, func);
  };
}
