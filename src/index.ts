import { Controller, Delete, Get, Mapping, Middleware, Module, Post, Put, Summary, Type } from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Dto } from '@/dto';
import { Params } from '@/params';
import { ArrayCheck, Declare, Model, ModelResult, Required, StringLength, TypeCheck, TypeCustom } from '@/model';
import { DataType, MethodType, ModelConfigCache, ParamsSource, ParamsType, StatusCode } from '@/values';
import { Router } from '@/router';
import { Context } from '@/context';
import http from 'http';
import { ContextAsyncHandler, ContextBase } from '@/context/types';
import { FunctionArgs, FunctionError } from '@/types';
import { Server } from 'net';

export default class Tiny {
  constructor() {}

  /*
   * Execute before entering the controller after requesting entry
   */
  public begin?: ContextAsyncHandler;

  /*
   * Execute after the request is completed, i.e. execute after res triggers pre finish
   */
  public finish?: (context: ContextBase) => any;

  /*
   * Internal error in monitoring controller
   */
  public onerror?: (err: FunctionError) => any = () => {};

  /*
   * Create service port
   */
  public listen(...args: FunctionArgs): Server {
    const server = http.createServer(async (req, res) => {
      try {
        const context = new Context(req, res);
        const next = Router.run.bind(this, context);
        if (this.begin) {
          this.begin(context, next);
        } else {
          next();
        }
        context.res.on('prefinish', () => {
          if (this.finish) this.finish(context);
        });
      } catch (e: FunctionError) {
        res.statusCode = 500;
        res.end('Internal Server Error');
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
