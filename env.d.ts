import Koa from 'koa';
import { Files } from 'formidable';
import { DataType, MethodType } from '@/values';
import { NextFunction, Request, Response } from 'express-serve-static-core';

declare module 'koa' {
  interface ExtendableContext {
    params?: any;
    payload?: any;
    request: Request;

    <T>(body: T): T;
  }

  interface Request extends Koa.BaseRequest {
    body?: any;
    files?: Files;
  }
}

declare module 'express' {
  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
    METHOD?: MethodType;
    DATA_TYPE?: DataType;
    PREFIX?: string;
    MAPPING?: string;
    SUMMARY?: string;
    JWT_PROTECTED?: boolean;
  }
}
