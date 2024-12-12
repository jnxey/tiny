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

export default class Tiny {
  constructor(beforeEach?: ContextAsyncHandler, afterEach?: (context: ContextBase) => any) {
    Controller.init({
      get: Router.getRouteController(MethodType.get),
      post: Router.getRouteController(MethodType.post),
      delete: Router.getRouteController(MethodType.delete),
      put: Router.getRouteController(MethodType.put)
    });

    // Create HTTP Server
    return http.createServer(async (req, res) => {
      const context = new Context(req, res);
      const next = Router.run;
      if (beforeEach) {
        beforeEach(context, next);
      } else {
        next(context);
      }
      if (afterEach) {
        context.addListenFinish(() => {
          afterEach(context);
        });
      }
    });
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
