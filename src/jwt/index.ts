import { copyAttrToNew } from '@/tools';
import { JwtOptions, JwtOptionsInject, JwtOptionsIsResetToken, JwtOptionsRefuse, JwtOptionsSign, JwtOptionsVerify } from '@/jwt/types';
import { FunctionArgs } from '@/types';

/*
 * Jwt constructor
 */
export class Jwt {
  /*
   * Perform JWT signature
   */
  public static sign: JwtOptionsSign = () => Promise.resolve(null);

  /*
   * Perform JWT verification
   */
  public static verify: JwtOptionsVerify = () => Promise.resolve(null);

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
    const next: Function = descriptor.value;
    descriptor.value = function (...args: FunctionArgs) {
      Jwt.verify.apply(this, args).then((payload) => {
        if (!!payload) {
          const _args = next.apply(this, Jwt.inject(args, payload));
          if (Jwt.isResetToken(payload)) {
            Jwt.sign(args, payload).then(() => next.apply(this, _args));
          } else {
            next.apply(this, _args);
          }
        } else {
          Jwt.refuse.apply(this, args);
        }
      });
    };
    copyAttrToNew(descriptor.value, next);
  };
}
