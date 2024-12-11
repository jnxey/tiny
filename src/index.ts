import { Controller, Module, Delete, Get, Post, Put, Type, Handler, Mapping, Summary } from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Dto, DtoCtxExtend } from '@/dto';
import { Params, Result } from '@/params';
import { Declare, Model, ModelResult, Required, TypeCheck, StringLength, ArrayCheck, TypeCustom } from '@/model';
import { InitOptions } from '@/types';
import { MethodType, DataType, ParamsSource, ParamsType, ModelConfigCache, StatusCode } from '@/values';

class Tiny {
  // Init
  public static init(options: InitOptions): void {
    if (options.controller) Controller.init(options.controller);
    if (options.jwt) Jwt.init(options.jwt);
  }
}

export {
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
  TypeCustom,
  // values
  MethodType,
  DataType,
  ParamsSource,
  ParamsType,
  ModelConfigCache,
  StatusCode
};

export default Tiny;
