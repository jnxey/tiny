import { ContextAsyncHandler, ContextBase } from '@/context/types';

export type JwtSign = (context: ContextBase) => string | null | undefined;

export type JwtVerify = ContextAsyncHandler;

export type JwtOptions = {
  verify?: JwtVerify;
  sign?: JwtSign;
};
