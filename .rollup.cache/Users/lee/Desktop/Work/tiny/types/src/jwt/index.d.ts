import { JwtOptions, JwtOptionsInput } from '@/types/jwt';
import { ExtendableContext } from 'koa';
export declare class Jwt {
    static options: JwtOptions;
    static init(options: JwtOptionsInput): void;
    static verify<T>(ctx: ExtendableContext): T | null;
    static sign<T>(ctx: ExtendableContext, payload: T): string;
}
export declare function Protected(): Function;
