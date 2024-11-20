import { ExtendableContext } from 'koa';

export type JwtOptions = {
  privateKey: string;
  algorithms: string;
  expiresIn: string;
  ignoreExpiration: boolean;
  errorCode: number;
  tokenKey: string;
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
  tokenKey?: string;
  getToken?: (ctx: ExtendableContext) => string | undefined;
  setToken?: (ctx: ExtendableContext, value: string) => any;
  isResetToken?: (ctx: ExtendableContext) => boolean;
};
