import { IncomingMessage, ServerResponse } from 'http';
import { ContextBase, ContextBody, ContextExtend, ContextFiles, ContextParams, ContextPayload, ContextQuery } from '@/context/types';
import { DataType } from '@/values';
import { Dto } from '@/dto';
import { CookieManager } from '@/cookie';
import { isArray, isObject } from '@/tools';

export class Context implements ContextBase {
  /*
   * `context.req:IncomingMessage`，请求信息
   */
  public req: IncomingMessage;
  /*
   * `context.res:ServerResponse`，回文信息
   */
  public res: ServerResponse;
  /*
   * `context.query:object`，请求 查询参数 以及 路径参数 ，也意味着两种参数不能重名
   */
  public query: ContextQuery;
  /*
   * `context.body:object|string`，保存在body内的参数
   */
  public body: ContextBody;
  /*
   * `context.params:object`，通过`Tiny.Param.in`校验后参数
   */
  public params: ContextParams;
  /*
   * `context.payload:object|string`，通过`Tiny.Jwt`校验后的信息
   */
  public payload: ContextPayload;
  /*
   * `context.files:any[]`，可扩充的文件信息，`Tiny`内部未进行设置
   */
  public files: ContextFiles;
  /*
   * `context.extend:object`，可扩充的其他信息
   */
  public extend: ContextExtend = {};
  /*
   * `context.cookie:cookie`，cookie管理工具
   */
  public cookie!: CookieManager;

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
    this.cookie = new CookieManager(req, res);
  }

  /*
   * `context.send`，发送请求信息
   */
  send<T = Dto>(code: number, data: T) {
    this.res.writeHead(code, { 'Content-Type': DataType.json });
    if (isObject(data) || isArray(data)) {
      this.res.end(JSON.stringify(data));
    } else {
      this.res.end(String(data));
    }
  }

  /*
   * `context.setQuery`，设置地址参数信息
   */
  setQuery(query: ContextQuery) {
    this.query = query;
  }

  /*
   * `context.setBody`，设置body参数信息
   */
  setBody(body: ContextBody) {
    this.body = body;
  }

  /*
   * `context.setParams`，设置校验参数信息
   */
  setParams(params: ContextParams) {
    this.params = params;
  }

  /*
   * `context.setPayload`，设置Jwt校验信息
   */
  setPayload(payload: ContextPayload) {
    this.payload = payload;
  }

  /*
   * `context.setFiles`，设置文件信息
   */
  setFiles(files: ContextFiles) {
    this.files = files;
  }

  /*
   * `context.setExtend`，设置扩展信息
   */
  setExtend<T>(name: string, value: T) {
    this.extend[name] = value;
  }
}
