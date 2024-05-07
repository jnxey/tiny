import Koa from 'koa';
import { Files } from 'formidable';

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
