import { IncomingMessage, ServerResponse } from 'http';
import { Dto } from '@/dto';
import { CookieManager } from '@/cookie';
import { DataType } from '@/values';

export type ContextQuery = object | null | undefined;

export type ContextParams = object | null | undefined;

export type ContextPayload = object | string | null | undefined;

export type ContextBody = object | string | null | undefined;

export type ContextFiles = any[] | null | undefined;

export type ContextExtend = object;

export type ContextAsyncHandler = (context: ContextBase, next: () => any) => any;

export interface ContextBase {
  req: IncomingMessage;
  res: ServerResponse;
  query: ContextQuery;
  body: ContextBody;
  params: ContextParams;
  payload: ContextPayload;
  files: ContextFiles;
  cookie: CookieManager;
  error: Function;

  send<T = Dto>(code: number, data: T, type?: DataType): void;

  setError(error: Function): void;

  setQuery(query: ContextQuery): void;

  setBody(body: ContextBody): void;

  setParams(params: ContextParams): void;

  setPayload(payload: ContextPayload): void;

  setFiles(files: ContextFiles): void;

  setExtend<T>(name: string, value: T): void;
}
