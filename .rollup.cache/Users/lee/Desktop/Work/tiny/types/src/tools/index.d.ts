/**
 * 判断数据类型
 */
export declare const getType: (value: any) => string;
export declare const isNumber: (value: any) => boolean;
export declare const isString: (value: any) => boolean;
export declare const isArray: (value: any) => boolean;
export declare const isObject: (value: any) => boolean;
export declare const isBoolean: (value: any) => boolean;
export declare const isFunction: (value: any) => boolean;
export declare const isNull: (value: any) => boolean;
export declare const isUndefined: (value: any) => boolean;
export declare const isPromise: (value: any) => boolean;
export declare const isNode: (value: any) => boolean;
export declare const isElement: (value: any) => boolean;
export declare const isEmpty: (value: any) => boolean;
/**
 * 校验数据类型
 */
export declare function warn(msg: string): void;
/**
 * 驼峰命名=>中横线命名
 */
export declare function kebabCase(name: string): string;
/**
 *  中横线命名=>驼峰命名
 */
export declare function camelCase(name: string): string;
/**
 *  获取json
 */
export declare function getJSON(value?: string, def?: any): any;
/**
 *  给表单数据赋值
 */
export declare function syncObjectData(target: object, remote: object): void;
