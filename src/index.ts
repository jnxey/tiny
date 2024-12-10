import { Controller, Delete, Get, Post, Put, Type, Handler, Prefix, Mapping, Summary } from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Dto, DtoCtxExtend } from '@/dto';
import { Params, Result } from '@/params';
import { Declare, Model, ModelResult, Required, TypeCheck, StringLength, ArrayCheck } from '@/model';
import { InitOptions } from '@/types';
import { MethodType, DataType, ParamsSource, ParamsType, ModelConfigCache, StatusCode } from '@/values';

class Tiny {
  // 初始化
  public static init(options: InitOptions): void {
    if (options.controller) Controller.init(options.controller);
    if (options.jwt) Jwt.init(options.jwt);
  }
}

export {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Type,
  Handler,
  Prefix,
  Mapping,
  Summary,
  // jwt
  Jwt,
  Protected,
  // dto
  Dto,
  DtoCtxExtend,
  // params
  Params,
  Result,
  Model,
  ModelResult,
  Declare,
  Required,
  TypeCheck,
  StringLength,
  ArrayCheck,
  // values
  MethodType,
  DataType,
  ParamsSource,
  ParamsType,
  ModelConfigCache,
  StatusCode
};

export default Tiny;
