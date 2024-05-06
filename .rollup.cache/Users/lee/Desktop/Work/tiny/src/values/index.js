/*
 * 请求方法装饰器
 */
export var MethodType;
(function (MethodType) {
    MethodType[MethodType["get"] = 0] = "get";
    MethodType[MethodType["delete"] = 1] = "delete";
    MethodType[MethodType["post"] = 2] = "post";
    MethodType[MethodType["put"] = 3] = "put";
    MethodType[MethodType["view"] = 4] = "view";
})(MethodType || (MethodType = {}));
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
export var DataType;
(function (DataType) {
    DataType[DataType["json"] = 0] = "json";
    DataType[DataType["text"] = 1] = "text";
    DataType[DataType["formUrlencoded"] = 2] = "formUrlencoded";
    DataType[DataType["formData"] = 3] = "formData";
    DataType[DataType["jsonPatchJson"] = 4] = "jsonPatchJson";
    DataType[DataType["vndApiJson"] = 5] = "vndApiJson";
    DataType[DataType["cspReport"] = 6] = "cspReport";
    DataType[DataType["other"] = 7] = "other";
})(DataType || (DataType = {}));
/*
 * 参数来源
 */
export var ParamsSource;
(function (ParamsSource) {
    ParamsSource[ParamsSource["query"] = 0] = "query";
    ParamsSource[ParamsSource["body"] = 1] = "body";
})(ParamsSource || (ParamsSource = {}));
/*
 * 参数数据类型
 */
export var ParamsType;
(function (ParamsType) {
    ParamsType[ParamsType["number"] = 0] = "number";
    ParamsType[ParamsType["boolean"] = 1] = "boolean";
    ParamsType[ParamsType["string"] = 2] = "string";
})(ParamsType || (ParamsType = {}));
/*
 * 缓存参数配置的键
 */
export const ParamsConfigCache = 'PARAMS_CONFIG_CACHE';
/*
 * 参数数据类型
 */
export const StatusCode = {
    paramsError: 400,
    authError: 408
};
