/*
 * 请求方法装饰器
 */
export enum MethodType {
  get = 'get',
  delete = 'delete',
  post = 'post',
  put = 'put',
  view = 'view'
}

/*
 * body的数据结构
 * json: 'application/json',
 * text: 'text/xml',
 * formData: 'application/x-www-form-urlencoded',
 * other: 'other'
 */
export enum DataType {
  json = 'application/json',
  text = 'text/plain',
  formUrlencoded = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data',
  other = 'other'
}

/*
 * 参数来源
 */
export enum ParamsSource {
  query = 'query',
  body = 'body'
}

/*
 * 参数数据类型
 */
export enum ParamsType {
  number = 'number',
  boolean = 'boolean',
  string = 'string'
}

/*
 * 缓存参数配置的键
 */
export const ParamsConfigCache = 'PARAMS_CONFIG_CACHE';

/*
 * 参数数据类型
 */
export const StatusCode = {
  success: 200,
  paramsError: 400,
  authError: 408,
  serveError: 500
};
