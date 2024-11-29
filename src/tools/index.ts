/**
 * 判断数据类型
 */
export const getType = (value: any): string => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
export const isNumber = (value: any): boolean => getType(value) === 'number';
export const isString = (value: any): boolean => getType(value) === 'string';
export const isArray = (value: any): boolean => getType(value) === 'array';
export const isObject = (value: any): boolean => getType(value) === 'object';
export const isBoolean = (value: any): boolean => getType(value) === 'boolean';
export const isFunction = (value: any): boolean => getType(value).toLowerCase().indexOf('function') > -1;
export const isNull = (value: any): boolean => getType(value) === 'null';
export const isUndefined = (value: any): boolean => getType(value) === 'undefined';
export const isPromise = (value: any): boolean => getType(value) === 'promise';
export const isNode = (value: any): boolean => !isNull(value) && !isUndefined(value) && Boolean(value.nodeName) && Boolean(value.nodeType);
export const isElement = (value: any): boolean => isNode(value) && value.nodeType === 1;
export const isDate = (value: any): boolean => getType(value) === 'date';
export const isEmpty = (value: any): boolean => value === undefined || value === '' || value === null;

/**
 * 校验数据类型
 */
export function warn(msg: string) {
  throw new Error(msg);
}

/**
 * 驼峰命名=>中横线命名
 */
export function kebabCase(name: string): string {
  if (!isString(name)) warn('Name must be a string');
  const hyphenateRE: RegExp = /([^-])([A-Z])/g;
  return name.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
}

/**
 *  中横线命名=>驼峰命名
 */
export function camelCase(name: string): string {
  if (!isString(name)) warn('Name must be a string');
  const SPECIAL_CHARS_REGEXP: RegExp = /([:\-_]+(.))/g;
  const MOZ_HACK_REGEXP: RegExp = /^moz([A-Z])/;
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/**
 *  获取json
 */
export function getJSON(value?: string, def?: any) {
  if (!value) return def;
  try {
    return JSON.parse(value);
  } catch (e) {
    return def;
  }
}

/**
 *  给表单数据赋值
 */
export function syncObjectData(target: object, remote: object) {
  Object.keys(target).forEach(function (name: string) {
    if (remote[name] !== undefined) target[name] = remote[name];
  });
}

/**
 *  复制方法的属性给新的方法
 */
export function copyAttrToNew(fn1: Function, fn2: Function) {
  Object.keys(fn2).forEach(function (name: string) {
    fn1[name] = fn2[name];
  });
}
