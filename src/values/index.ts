/*
 * 请求方法装饰器
 */
export enum MethodType {
  get,
  delete,
  post,
  put,
  view
}

/*
 * body的数据结构
 * json: 'application/json',
 *  text: 'text/xml',
 *  formUrlencoded: 'application/x-www-form-urlencoded',
 *  formData: 'multipart/form-data',
 *  jsonPatchJson: 'application/json-patch+json',
 *  vndApiJson: 'application/vnd.api+json',
 *  cspReport: 'application/csp-report',
 *  other: 'other'
 */
export enum DataType {
  json,
  text,
  formUrlencoded,
  formData,
  jsonPatchJson,
  vndApiJson,
  cspReport,
  other
}

/*
 * 参数来源
 */
export enum ParamsSource {
  query,
  body
}

/*
 * 参数数据类型
 */
export enum ParamsType {
  number,
  boolean,
  string
}

/*
 * 缓存参数配置的键
 */
export const ParamsConfigCache = 'PARAMS_CONFIG_CACHE';

/*
 * 参数数据类型
 */
export const StatusCode = {
  paramsError: 400,
  authError: 408,
  serveError: 500
};
