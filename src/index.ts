import { Controller, Module, Delete, Get, Post, Put, Type, Handler, Mapping, Summary } from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Dto } from '@/dto';
import { Params } from '@/params';
import { Declare, Model, ModelResult, Required, TypeCheck, StringLength, ArrayCheck, TypeCustom } from '@/model';
import { InitOptions } from '@/types';
import { MethodType, DataType, ParamsSource, ParamsType, ModelConfigCache, StatusCode } from '@/values';
import { Router } from '@/router';

const Init = (options: InitOptions): void => {
  if (options.controller) Controller.init(options.controller);
  if (options.jwt) Jwt.init(options.jwt);
  if (options.params) Params.init(options.params);
};

export {
  Init,
  // controller
  Controller,
  Module,
  Get,
  Delete,
  Post,
  Put,
  Type,
  Handler,
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
