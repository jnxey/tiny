import { IncomingMessage, ServerResponse } from 'http';
import { ContextBase, ContextBody, ContextExtend, ContextFiles, ContextParams, ContextPayload, ContextQuery } from '@/context/types';
import { DataType } from '@/values';
import { Dto } from '@/dto';

export class Context implements ContextBase {
  public req: IncomingMessage;
  public res: ServerResponse;
  public query: ContextQuery;
  public params: ContextParams;
  public payload: ContextPayload;
  public body: ContextBody;
  public files: ContextFiles;
  public extend: ContextExtend = {};

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
  }

  send(code: number, data: Dto) {
    this.res.writeHead(code, { 'Content-Type': DataType.json });
    this.res.end(JSON.stringify(data));
  }

  setQuery(query: ContextQuery) {
    this.query = query;
  }

  setParams(params: ContextParams) {
    this.params = params;
  }

  setPayload(payload: ContextPayload) {
    this.payload = payload;
  }

  setBody(body: ContextBody) {
    this.body = body;
  }

  setFiles(files: ContextFiles) {
    this.files = files;
  }

  setExtend<T>(name: string, value: T) {
    this.extend[name] = value;
  }
}
