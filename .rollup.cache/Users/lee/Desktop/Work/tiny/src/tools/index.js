/**
 * 判断数据类型
 */
export const getType = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
export const isNumber = (value) => getType(value) === 'number';
export const isString = (value) => getType(value) === 'string';
export const isArray = (value) => getType(value) === 'array';
export const isObject = (value) => getType(value) === 'object';
export const isBoolean = (value) => getType(value) === 'boolean';
export const isFunction = (value) => getType(value).toLowerCase().indexOf('function') > -1;
export const isNull = (value) => getType(value) === 'null';
export const isUndefined = (value) => getType(value) === 'undefined';
export const isPromise = (value) => getType(value) === 'promise';
export const isNode = (value) => !isNull(value) && !isUndefined(value) && Boolean(value.nodeName) && Boolean(value.nodeType);
export const isElement = (value) => isNode(value) && value.nodeType === 1;
export const isEmpty = (value) => value === undefined || value === '' || value === null;
/**
 * 校验数据类型
 */
export function warn(msg) {
    throw new Error(msg);
}
/**
 * 驼峰命名=>中横线命名
 */
export function kebabCase(name) {
    if (!isString(name))
        warn('Name must be a string');
    const hyphenateRE = /([^-])([A-Z])/g;
    return name.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
}
/**
 *  中横线命名=>驼峰命名
 */
export function camelCase(name) {
    if (!isString(name))
        warn('Name must be a string');
    const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
    const MOZ_HACK_REGEXP = /^moz([A-Z])/;
    return name
        .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    })
        .replace(MOZ_HACK_REGEXP, 'Moz$1');
}
/**
 *  获取json
 */
export function getJSON(value, def) {
    if (!value)
        return def;
    try {
        return JSON.parse(value);
    }
    catch (e) {
        return def;
    }
}
/**
 *  给表单数据赋值
 */
export function syncObjectData(target, remote) {
    Object.keys(target).forEach(function (name) {
        target[name] = remote[name];
    });
}
