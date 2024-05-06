import { ParamsSource, ParamsType } from '@/values';
export declare function Params<T extends ParamsModel>(params: {
    new (): T;
}, type: ParamsSource): Function;
export declare class ParamsModel {
    static def: {
        number: number;
        boolean: boolean;
        string: string;
    };
    fill<T>(map: object): ParamsModelResult;
}
export declare class ParamsModelResult {
    valid: boolean;
    message: string;
    constructor(valid: boolean, message?: string);
}
/**
 * 添加参数声明，以及描述提示语
 */
export declare function Declare(description?: string): Function;
/**
 * 添加参数提示语
 */
export declare function Required(message?: string): Function;
/**
 * 添加类型错误提示语
 */
export declare function TypeError<T>(type: ParamsType | T, message?: string): Function;
