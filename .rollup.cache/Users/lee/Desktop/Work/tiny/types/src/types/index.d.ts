/// <reference types="koa__router" />
import { ControllerOptionsInput } from '@/types/controller';
import { JwtOptionsInput } from '@/types/jwt';
import Koa from "koa";
import Router from "@koa/router";
export interface InitOptions {
    controller?: ControllerOptionsInput;
    jwt?: JwtOptionsInput;
}
export interface InitOutput {
    app: Koa;
    router: Router;
}
