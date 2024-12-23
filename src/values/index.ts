/*
 * Request method type
 */
export enum MethodType {
  head = 'HEAD',
  options = 'OPTIONS',
  get = 'GET',
  delete = 'DELETE',
  post = 'POST',
  put = 'PUT',
  patch = 'PATCH'
}

/*
 * Content-type
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
  other = 'other'
}

/*
 * Parameter source
 */
export enum ParamsSource {
  query = 'query',
  body = 'body'
}

/*
 * Parameter data type
 */
export enum ParamsType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  array = 'array'
}

/*
 * Http Code value
 */
export const StatusCode = {
  success: 200,
  paramsError: 400,
  authError: 401,
  notFound: 404,
  timeout: 408,
  serveError: 500
};

/*
 * Cache parameter configuration key
 */
export const ModelConfigCache = 'PARAMS_CONFIG_CACHE';

/*
 * Permission verification failure prompt
 */
export const JwtVerifyRefuse = 'Permission verification failed';

/*
 * Router Not Found Prompt
 */
export const RouterNotFound = '404 Not Found';
