import { Controller, Delete, Get, Mapping, Middleware, Module, Post, Put, Patch, Summary, Type } from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Dto } from '@/dto';
import { Params } from '@/params';
import { ArrayCheck, Declare, Model, ModelResult, Required, StringLength, TypeCheck, TypeCustom } from '@/model';
import { DataType, MethodType, ModelConfigCache, ParamsSource, ParamsType, StatusCode } from '@/values';
import { Router } from '@/router';
import { Context } from '@/context';
import http, { IncomingMessage, ServerResponse } from 'http';
import { ContextBase } from '@/context/types';
import { FunctionArgs, FunctionError } from '@/types';
import { Server } from 'net';

export default class Tiny {
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
  public onerror?: (err: FunctionError) => any = () => {};

  /*
   * Create service port
   */
  public listen(...args: FunctionArgs): Server {
    const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const context = new Context(req, res);
        this.run(context);
      } catch (e: FunctionError) {
        res.statusCode = this.errorCode;
        res.end(this.errorMsg);
        if (this.onerror) this.onerror(e);
      }
    });
    return server.listen(...args);
  }
}

export {
  // context
  Context,
  // controller
  Controller,
  Module,
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
  ModelConfigCache,
  StatusCode
};
