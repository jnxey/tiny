import Router from '@koa/router';
import { KoaBodyMiddlewareOptions } from 'koa-body/lib/types';
import { ExtendableContext } from 'koa';

declare enum MethodType {
    get = 0,
    delete = 1,
    post = 2,
    put = 3,
    view = 4
}
declare enum DataType {
    json = 0,
    text = 1,
    formUrlencoded = 2,
    formData = 3,
    jsonPatchJson = 4,
    vndApiJson = 5,
    cspReport = 6,
    other = 7
}
declare enum ParamsSource {
    query = 0,
    body = 1
}
declare enum ParamsType {
    number = 0,
    boolean = 1,
    string = 2
}
declare const ParamsConfigCache = "PARAMS_CONFIG_CACHE";
declare const StatusCode: {
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
declare function JsonPatchJson(options?: Partial<KoaBodyMiddlewareOptions>): Function;
declare function VndApiJson(options?: Partial<KoaBodyMiddlewareOptions>): Function;
declare function CspReport(options?: Partial<KoaBodyMiddlewareOptions>): Function;
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

declare class ParamsModel {
    static def: {
        number: number;
        boolean: boolean;
        string: string;
    };
    fill<T>(map: object): ParamsModelResult;
}
declare class ParamsModelResult {
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
declare function TypeError<T>(type: ParamsType | T, message?: string): Function;

interface InitOptions {
    controller?: ControllerOptionsInput;
    jwt?: JwtOptionsInput;
}

declare class Tiny {
    static init(options: InitOptions): void;
}

export { Controller, CspReport, DataType, Declare, Delete, Dto, FormData, FormUrlencoded, Get, Json, JsonPatchJson, Jwt, Mapping, MethodType, Other, ParamsConfigCache, ParamsModel, ParamsModelResult, ParamsSource, ParamsType, Post, Prefix, Protected, Put, Required, StatusCode, Summary, Text, TypeError, View, VndApiJson, Tiny as default };
