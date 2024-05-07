import { ControllerOptionsInput } from '@/controller/types';
import { JwtOptionsInput } from '@/jwt/types';
import Koa from 'koa';
import Router from '@koa/router';

export interface InitOptions {
  controller?: ControllerOptionsInput;
  jwt?: JwtOptionsInput;
}

export interface InitOutput {
  app: Koa;
  router: Router;
}
