export declare enum MethodType {
    get = 0,
    delete = 1,
    post = 2,
    put = 3,
    view = 4
}
export declare enum DataType {
    json = 0,
    text = 1,
    formUrlencoded = 2,
    formData = 3,
    jsonPatchJson = 4,
    vndApiJson = 5,
    cspReport = 6,
    other = 7
}
export declare enum ParamsSource {
    query = 0,
    body = 1
}
export declare enum ParamsType {
    number = 0,
    boolean = 1,
    string = 2
}
export declare const ParamsConfigCache = "PARAMS_CONFIG_CACHE";
export declare const StatusCode: {
    paramsError: number;
    authError: number;
};
