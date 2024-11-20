import { ExtendableContext } from 'koa';
import { StatusCode } from '@/values/index';


export const options = {
  controller: {
    prefix: '',
    hump: false
  },
  jwt: {
    privateKey: 'shared-secret',
    algorithms: 'HS256',
    expiresIn: '4h',
    ignoreExpiration: false,
    errorCode: StatusCode.authError,
    tokenKey: 'token',
    getToken: function(res) {
      return res.cookies.get(options.jwt.tokenKey);
    },
    setToken: function(ctx: ExtendableContext, value: string) {
      return ctx.cookies.set(options.jwt.tokenKey, value);
    }
  }
};

export interface Options {
  controller: {
    prefix: string;
    hump: boolean;
  };
  jwt: {
    privateKey: string;
    algorithms: string;
    expiresIn: string;
    ignoreExpiration: boolean;
    errorCode: number;
    tokenKey: string;
    getToken: (ctx: ExtendableContext) => string | undefined;
    setToken: (ctx: ExtendableContext, value: string) => any;
  };
}

export interface OptionsInput {
  controller: {
    prefix?: string;
    hump?: boolean;
  };
  jwt: {
    privateKey?: string;
    algorithms?: string;
    expiresIn?: string;
    ignoreExpiration?: boolean;
    errorCode?: number;
    tokenKey?: string;
    getToken?: (ctx: ExtendableContext) => string | undefined;
    setToken?: (ctx: ExtendableContext, value: string) => any;
  };
}
