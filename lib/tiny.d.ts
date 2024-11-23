/// <reference types="koa__router" />
import Router from '@koa/router';
import { KoaBodyMiddlewareOptions } from 'koa-body/lib/types';
import { ExtendableContext } from 'koa';

declare enum MethodType {
    get = "get",
    delete = "delete",
    post = "post",
    put = "put",
    view = "view"
}
declare enum DataType {
    json = "application/json",
    text = "text/plain",
    formUrlencoded = "application/x-www-form-urlencoded",
    formData = "multipart/form-data",
    other = "other"
}
declare enum ParamsSource {
    query = "query",
    body = "body"
}
declare enum ParamsType {
    number = "number",
    boolean = "boolean",
    string = "string"
}
declare const ModelConfigCache = "PARAMS_CONFIG_CACHE";
declare const StatusCode: {
    success: number;
    paramsError: number;
    authError: number;
    serveError: number;
};

type ControllerOptions = {
    prefix: string;
    hump: boolean;
};
type ControllerOptionsInput = {
    prefix?: string;
    hump?: boolean;
};

declare class Controller {
    static options: ControllerOptions;
    static jwtProtectedList: string[];
    static apiInfoJson: object[];
    static init(options: ControllerOptionsInput): void;
    static connect<T>(instance: T, router: Router): void;
}
declare function Get(): Function;
declare function Delete(): Function;
declare function Post(): Function;
declare function Put(): Function;
declare function View(): Function;
declare function Json(options?: Partial<KoaBodyMiddlewareOptions>): Function;
declare function Text(options?: Partial<KoaBodyMiddlewareOptions>): Function;
declare function FormUrlencoded(options?: Partial<KoaBodyMiddlewareOptions>): Function;
declare function FormData(options?: Partial<KoaBodyMiddlewareOptions>): Function;
declare function Other(): Function;
declare function Prefix(text: string): Function;
declare function Mapping(path: string): Function;
declare function Summary(text: string): Function;

type JwtOptions = {
    privateKey: string;
    algorithms: string;
    expiresIn: string;
    ignoreExpiration: boolean;
    errorCode: number;
    tokenKey: string;
    getToken: (ctx: ExtendableContext) => string | undefined;
    setToken: (ctx: ExtendableContext, value: string) => any;
    isResetToken: (ctx: ExtendableContext) => boolean;
};
type JwtOptionsInput = {
    privateKey?: string;
    algorithms?: string;
    expiresIn?: string;
    ignoreExpiration?: boolean;
    errorCode?: number;
    tokenKey?: string;
    getToken?: (ctx: ExtendableContext) => string | undefined;
    setToken?: (ctx: ExtendableContext, value: string) => any;
    isResetToken?: (ctx: ExtendableContext) => boolean;
};

declare class Jwt {
    static options: JwtOptions;
    static init(options: JwtOptionsInput): void;
    static verify<T>(ctx: ExtendableContext): T | null;
    static sign<T>(ctx: ExtendableContext, payload: T): string;
}
declare function Protected(): Function;

interface DtoInput {
    code: string | number;
    msg?: string;
    result?: any;
}

declare class Dto {
    code: string | number;
    result: any;
    msg?: string;
    constructor({ code, result, msg }: DtoInput);
}
declare class DtoCtxExtend<P1 = any, P2 = any> {
    params: P1;
    payload: P2;
    constructor({ params, payload }: {
        params: any;
        payload: any;
    });
    setParams(params: P1): void;
    setPayload(payload: P2): void;
}

declare class Model {
    static def: {
        number: number;
        boolean: boolean;
        string: string;
        null: null;
    };
    getConfigCache(): any;
    fill<T>(map: object): ModelResult;
}
declare class ModelResult {
    valid: boolean;
    message: string;
    constructor(valid: boolean, message?: string);
}
/**
 * 添加参数声明，以及描述提示语
 */
declare function Declare(description?: string): Function;
/**
 * 添加参数提示语
 */
declare function Required(message?: string): Function;
/**
 * 添加类型错误提示语
 */
declare function TypeCheck<T>(type: ParamsType | T, message?: string): Function;
/**
 * 添加类型错误提示语
 */
declare function StringLength<T>(range: number[], message?: string): Function;

declare function Params<T extends Model>(params: {
    new (): T;
}, type: ParamsSource, validate?: boolean): Function;
declare function Result<T extends Model>(result: {
    new (): T;
}): Function;

interface InitOptions {
    controller?: ControllerOptionsInput;
    jwt?: JwtOptionsInput;
}

declare class Tiny {
    static init(options: InitOptions): void;
}

export { Controller, DataType, Declare, Delete, Dto, DtoCtxExtend, FormData, FormUrlencoded, Get, Json, Jwt, Mapping, MethodType, Model, ModelConfigCache, ModelResult, Other, Params, ParamsSource, ParamsType, Post, Prefix, Protected, Put, Required, Result, StatusCode, StringLength, Summary, Text, TypeCheck, View, Tiny as default };
