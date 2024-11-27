import { ExtendableContext } from 'koa';

export type JwtOptions = {
  privateKey: string;
  algorithms: string;
  expiresIn: string;
  ignoreExpiration: boolean;
  errorCode: number;
  errorMsg: string;
  tokenKey: string;
  jsonwebtoken: { verify: Function; sign: Function };
  getToken: (ctx: ExtendableContext) => string | undefined;
  setToken: (ctx: ExtendableContext, value: string) => any;
  isResetToken: (ctx: ExtendableContext) => boolean;
};

export type JwtOptionsInput = {
  privateKey?: string;
  algorithms?: string;
  expiresIn?: string;
  ignoreExpiration?: boolean;
  errorCode?: number;
  errorMsg?: string;
  tokenKey?: string;
  jsonwebtoken: { verify: Function; sign: Function };
  getToken?: (ctx: ExtendableContext) => string | undefined;
  setToken?: (ctx: ExtendableContext, value: string) => any;
  isResetToken?: (ctx: ExtendableContext) => boolean;
};
