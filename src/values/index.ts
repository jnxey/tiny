/*
 * 请求方法装饰器
 */
export enum MethodType {
  get = 'get',
  delete = 'delete',
  post = 'post',
  put = 'put'
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
  html = 'text/html',
  xml = 'text/xml',
  formUrlencoded = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data',
  stream = 'application/octet-stream',
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
  string = 'string',
  array = 'array'
}

/*
 * Response状态值
 */
export const StatusCode = {
  success: 200,
  paramsError: 400,
  authError: 408,
  serveError: 500
};

/*
 * 缓存参数配置的键
 */
export const ModelConfigCache = 'PARAMS_CONFIG_CACHE';
