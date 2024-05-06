import {
  Controller,
  CspReport,
  Delete,
  FormData,
  FormUrlencoded,
  Get,
  Json,
  JsonPatchJson,
  Mapping,
  Other,
  Post,
  Prefix,
  Put,
  Summary,
  Text,
  View,
  VndApiJson
} from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Declare, ParamsModel, ParamsModelResult, Required, TypeError } from '@/params';
import { InitOptions, InitOutput } from '@/types';
import Koa from 'koa';
import Router from '@koa/router';

const Tiny = {
  // Controller
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
  JsonPatchJson,
  VndApiJson,
  CspReport,
  Other,
  Prefix,
  Mapping,
  Summary,
  // jwt
  Jwt,
  Protected,
  // params
  ParamsModel,
  ParamsModelResult,
  Declare,
  Required,
  TypeError,
  // 初始化
  init(options: InitOptions): InitOutput {
    if (options.controller) Controller.init(options.controller);
    if (options.jwt) Jwt.init(options.jwt);
    return {
      app: new Koa(),
      router: new Router()
    };
  }
};

export default Tiny;
