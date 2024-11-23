import { Controller, Delete, FormData, FormUrlencoded, Get, Json, Mapping, Other, Post, Prefix, Put, Summary, Text, View } from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Dto, DtoCtxExtend } from '@/dto';
import { Params, Result, Declare, ParamsModel, ParamsModelResult, Required, TypeError } from '@/params';
import { InitOptions } from '@/types';
import { MethodType, DataType, ParamsSource, ParamsType, ParamsConfigCache, StatusCode } from '@/values';

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
  View,
  Json,
  Text,
  FormUrlencoded,
  FormData,
  Other,
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
  ParamsModel,
  ParamsModelResult,
  Declare,
  Required,
  TypeError,
  // values
  MethodType,
  DataType,
  ParamsSource,
  ParamsType,
  ParamsConfigCache,
  StatusCode
};

export default Tiny;
