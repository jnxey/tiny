import { Controller, CspReport, Delete, FormData, FormUrlencoded, Get, Json, JsonPatchJson, Mapping, Other, Post, Prefix, Put, Summary, Text, View, VndApiJson } from '@/controller';
import { Jwt, Protected } from '@/jwt';
import { Declare, ParamsModel, ParamsModelResult, Required, TypeError } from '@/params';
import { InitOptions, InitOutput } from '@/types';
declare const Tiny: {
    Controller: typeof Controller;
    Get: typeof Get;
    Delete: typeof Delete;
    Post: typeof Post;
    Put: typeof Put;
    View: typeof View;
    Json: typeof Json;
    Text: typeof Text;
    FormUrlencoded: typeof FormUrlencoded;
    FormData: typeof FormData;
    JsonPatchJson: typeof JsonPatchJson;
    VndApiJson: typeof VndApiJson;
    CspReport: typeof CspReport;
    Other: typeof Other;
    Prefix: typeof Prefix;
    Mapping: typeof Mapping;
    Summary: typeof Summary;
    Jwt: typeof Jwt;
    Protected: typeof Protected;
    ParamsModel: typeof ParamsModel;
    ParamsModelResult: typeof ParamsModelResult;
    Declare: typeof Declare;
    Required: typeof Required;
    TypeError: typeof TypeError;
    init(options: InitOptions): InitOutput;
};
export default Tiny;
