import { ContextAsyncHandler, ContextBase } from '@/context/types';

export type JwtSign = <Payload = object>(context: ContextBase, payload: Payload) => string | null | undefined;

export type JwtVerify = ContextAsyncHandler;

export type JwtRefuse = (context: ContextBase) => any;
