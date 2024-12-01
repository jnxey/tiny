import { ExtendableContext } from 'koa';

export type JwtOptions = {
  jsonwebtoken: { verify: Function; sign: Function };
  privateKey: string;
  algorithms: string;
  expiresIn: string;
  ignoreExpiration: boolean;
  errorCode: number;
  errorMsg: string;
  tokenKey: string;
  getToken: (ctx: ExtendableContext) => string | undefined;
  setToken: (ctx: ExtendableContext, value: string) => any;
  isResetToken: (ctx: ExtendableContext) => boolean;
};

export type JwtOptionsInput = {
  jsonwebtoken: { verify: Function; sign: Function };
  privateKey?: string;
  algorithms?: string;
  expiresIn?: string;
  ignoreExpiration?: boolean;
  errorCode?: number;
  errorMsg?: string;
  tokenKey?: string;
  getToken?: (ctx: ExtendableContext) => string | undefined;
  setToken?: (ctx: ExtendableContext, value: string) => any;
  isResetToken?: (ctx: ExtendableContext) => boolean;
};
