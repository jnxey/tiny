/// <reference types="koa__router" />
import Router from '@koa/router';
import { ControllerOptions, ControllerOptionsInput } from '@/types/controller';
import { KoaBodyMiddlewareOptions } from 'koa-body/lib/types';
export declare class Controller {
    static options: ControllerOptions;
    static jwtProtectedList: string[];
    static init(options: ControllerOptionsInput): void;
    static connect<T>(instance: T, router: Router): void;
}
export declare function Get(): Function;
export declare function Delete(): Function;
export declare function Post(): Function;
export declare function Put(): Function;
export declare function View(): Function;
export declare function Json(options?: Partial<KoaBodyMiddlewareOptions>): Function;
export declare function Text(options?: Partial<KoaBodyMiddlewareOptions>): Function;
export declare function FormUrlencoded(options?: Partial<KoaBodyMiddlewareOptions>): Function;
export declare function FormData(options?: Partial<KoaBodyMiddlewareOptions>): Function;
export declare function JsonPatchJson(options?: Partial<KoaBodyMiddlewareOptions>): Function;
export declare function VndApiJson(options?: Partial<KoaBodyMiddlewareOptions>): Function;
export declare function CspReport(options?: Partial<KoaBodyMiddlewareOptions>): Function;
export declare function Other(): Function;
export declare function Prefix(text: string): Function;
export declare function Mapping(path: string): Function;
export declare function Summary(text: string): Function;
