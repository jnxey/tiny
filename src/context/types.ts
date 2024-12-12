import { IncomingMessage, ServerResponse } from 'http';
import { Dto } from '@/dto';
import { DataType } from '@/values';

export type ContextQuery = object | null | undefined;

export type ContextParams = object | null | undefined;

export type ContextPayload = object | string | null | undefined;

export type ContextBody = object | string | null | undefined;

export type ContextFiles = any[] | null | undefined;

export type ContextExtend = object;

export type ContextAsyncHandler = (context: ContextBase, next: (context: ContextBase) => any) => any;

export interface ContextBase {
  req: IncomingMessage;
  res: ServerResponse;
  query: ContextQuery;
  params: ContextParams;
  payload: ContextPayload;
  body: ContextBody;
  files: ContextFiles;
  finishCallback: Function[];

  finish(code: number, data: Dto): void;

  setQuery(query: ContextQuery): void;

  setParams(params: ContextParams): void;

  setPayload(payload: ContextPayload): void;

  setBody(body: ContextBody): void;

  setFiles(files: ContextFiles): void;

  setExtend<T>(name: string, value: T): void;
}