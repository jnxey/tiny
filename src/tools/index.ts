/**
 * 判断数据类型
 */
export const getType = (obj: any): string => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
export const isNumber = (obj: any): boolean => getType(obj) === 'number';
export const isString = (obj: any): boolean => getType(obj) === 'string';
export const isArray = (obj: any): boolean => getType(obj) === 'array';
export const isObject = (obj: any): boolean => getType(obj) === 'object';
export const isBoolean = (obj: any): boolean => getType(obj) === 'boolean';
export const isFunction = (obj: any): boolean => getType(obj).toLowerCase().indexOf('function') > -1;
export const isNull = (obj: any): boolean => getType(obj) === 'null';
export const isUndefined = (obj: any): boolean => getType(obj) === 'undefined';
export const isPromise = (obj: any): boolean => getType(obj) === 'promise';
export const isNode = (node: any): boolean => !isNull(node) && !isUndefined(node) && Boolean(node.nodeName) && Boolean(node.nodeType);
export const isElement = (element: any): boolean => isNode(element) && element.nodeType === 1;

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
    target[name] = remote[name];
  });
}
