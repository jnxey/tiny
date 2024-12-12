/**
 * Determine data type
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
export const isRegexp = (value: any): boolean => getType(value) === 'regexp';
export const isEmpty = (value: any): boolean => value === undefined || value === '' || value === null;

/**
 * Throwing an error
 */
export function warn(msg: string) {
  throw new Error(msg);
}

/**
 * Hump naming=>Middle line naming
 */
export function kebabCase(name: string): string {
  if (!isString(name)) warn('Name must be a string');
  const hyphenateRE: RegExp = /([^-])([A-Z])/g;
  return name.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
}

/**
 *  Middle horizontal line naming=>Hump naming
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
 *  Get JSON
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
 *  Synchronize object data
 */
export function syncObjectData(target: object, remote: object) {
  Object.keys(target).forEach(function (name: string) {
    if (remote[name] !== undefined) target[name] = remote[name];
  });
}

/**
 *  Copy the properties of a method to a new method
 */
export function copyAttrToNew(fn1: Function, fn2: Function) {
  Object.keys(fn2).forEach(function (name: string) {
    fn1[name] = fn2[name];
  });
}

/**
 *  Analyze routing parameters
 */
export function parseRoute(url: string, routePattern: string): object | null {
  // Replace the parameter part in routePattern with the capture group in the regular expression
  const routeRegex = new RegExp(`^${routePattern.replace(/:\w+/g, '([^/]+)')}$`);
  const match = url.match(routeRegex);

  if (match) {
    // Create an object to store parameters
    const params = {};
    const paramNames = routePattern.match(/:\w+/g);

    if (paramNames) {
      paramNames.forEach((paramName, index) => {
        // Remove the colon before the parameter name
        const paramKey = paramName.slice(1);
        params[paramKey] = match[index + 1];
      });
    }
    return params;
  } else {
    return null; // No match found
  }
}
