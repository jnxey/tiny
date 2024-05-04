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
import { InitOptions } from '@/types';

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
  init(optioins: InitOptions) {
    if (optioins.controller) Controller.init(optioins.controller);
    if (optioins.jwt) Jwt.init(optioins.jwt);
  }
};

export default Tiny;
