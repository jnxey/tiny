import { Controller, Delete, Get, Mapping, Middleware, Post, Put, Patch, Summary, Type } from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Dto } from '@/dto';
import { Params } from '@/params';
import { ArrayCheck, Declare, Model, ModelResult, Required, StringLength, TypeCheck, TypeCustom } from '@/model';
import { DataType, MethodType, ModelConfigCache, ParamsSource, ParamsType, StatusCode } from '@/values';
import { Router } from '@/router';
import { Context } from '@/context';
import http, { IncomingMessage, ServerResponse } from 'http';
import { ContextBase } from '@/context/types';
import { FunctionArgs } from '@/types';
import { Server } from 'net';
import { isFunction } from '@/tools';

class CreateApp {
  /*
   * Error code
   */
  public errorCode: number = StatusCode.serveError;
  /*
   * Error message
   */
  public errorMsg: string = 'Internal Server Error';

  /*
   * To execute the program, it must be configured before listening
   */
  public run: (context: ContextBase) => any = () => {};

  /*
   * Internal error in monitoring controller
   */
  public error?: (err: Error | unknown) => any = () => {};

  /*
   * Create service port
   */
  public listen(...args: FunctionArgs): Server {
    const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const context = new Context(req, res);
        this.run(context);
      } catch (e: Error | unknown) {
        res.statusCode = this.errorCode;
        res.end(this.errorMsg);
        if (this.error && isFunction(this.error)) this.error(e);
      }
    });
    return server.listen(...args);
  }
}

const Tiny = {
  // CreateApp
  CreateApp,
  // context
  Context,
  // controller
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Patch,
  Type,
  Middleware,
  Mapping,
  Summary,
  // router
  Router,
  // jwt
  Jwt,
  Protected,
  // dto
  Dto,
  // model
  Model,
  ModelResult,
  Declare,
  Required,
  TypeCheck,
  StringLength,
  ArrayCheck,
  TypeCustom,
  // params
  Params,
  // values
  MethodType,
  DataType,
  ParamsSource,
  ParamsType,
  StatusCode,
  ModelConfigCache
};

export default Tiny;
