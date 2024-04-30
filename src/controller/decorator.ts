import { KoaBodyMiddlewareOptionsSchema } from 'koa-body/lib/types';

/*
 * 请求方法装饰器
 */
export class Method {
  public static Type = {
    get: 'get',
    delete: 'delete',
    post: 'post',
    put: 'put',
    view: 'view'
  };

  /*
   * Get装饰器
   */
  public static Get(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.METHOD = Method.Type.get;
    };
  }

  /*
   * Delete装饰器
   */
  public static Delete(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.METHOD = Method.Type.delete;
    };
  }

  /*
   * Post装饰器
   */
  public static Post(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.METHOD = Method.Type.post;
    };
  }

  /*
   * Put装饰器
   */
  public static Put(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.METHOD = Method.Type.put;
    };
  }

  /*
   * View装饰器
   */
  public static View(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.METHOD = Method.Type.view;
    };
  }
}

/*
 * body的数据结构
 */
export class DataType {
  public static Type = {
    json: 'application/json',
    text: 'text/xml',
    formUrlencoded: 'application/x-www-form-urlencoded',
    formData: 'multipart/form-data',
    jsonPatchJson: 'application/json-patch+json',
    vndApiJson: 'application/vnd.api+json',
    cspReport: 'application/csp-report',
    other: 'other'
  };

  /*
   * body的数据结构为json
   */
  public static Json(options: KoaBodyMiddlewareOptionsSchema): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.DATA_TYPE = DataType.Type.json;
      descriptor.value.DATA_TYPE_OPTIOINS = options || { json: true };
    };
  }

  /*
   * body的数据结构为文本
   */
  public static Text(options: KoaBodyMiddlewareOptionsSchema): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.DATA_TYPE = DataType.Type.text;
      descriptor.value.DATA_TYPE_OPTIOINS = options || { text: true };
    };
  }

  /*
   * body的数据结构为FormUrlencoded
   */
  public static FormUrlencoded(options: KoaBodyMiddlewareOptionsSchema): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.DATA_TYPE = DataType.Type.formUrlencoded;
      descriptor.value.DATA_TYPE_OPTIOINS = options;
    };
  }

  /*
   * body的数据结构为Form表单
   */
  public static FormData(options: KoaBodyMiddlewareOptionsSchema): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.DATA_TYPE = DataType.Type.formData;
      descriptor.value.DATA_TYPE_OPTIOINS = options;
    };
  }

  /*
   * body的数据结构为JsonPatchJson
   */
  public static JsonPatchJson(options: KoaBodyMiddlewareOptionsSchema): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.DATA_TYPE = DataType.Type.jsonPatchJson;
      descriptor.value.DATA_TYPE_OPTIOINS = options;
    };
  }

  /*
   * body的数据结构为VndApiJson
   */
  public static VndApiJson(options: KoaBodyMiddlewareOptionsSchema): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.DATA_TYPE = DataType.Type.vndApiJson;
      descriptor.value.DATA_TYPE_OPTIOINS = options;
    };
  }

  /*
   * body的数据结构为CspReport
   */
  public static CspReport(options: KoaBodyMiddlewareOptionsSchema): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.DATA_TYPE = DataType.Type.cspReport;
      descriptor.value.DATA_TYPE_OPTIOINS = options;
    };
  }

  /*
   * body的数据结构为Form表单
   */
  public static Other(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      descriptor.value.DATA_TYPE = DataType.Type.other;
    };
  }
}

/*
 * 给模块方法设置单独的前缀
 */
export function Prefix(): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.PREFIX = DataType.Other;
  };
}

/*
 * Mapping地址映射
 */
export function Mapping(path: string): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.MAPPING = path;
  };
}

/*
 * 对模块方法进行说明
 */
export function Summary(text: string): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.SUMMARY = text;
  };
}
