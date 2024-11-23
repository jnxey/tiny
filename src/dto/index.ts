import { DtoInput } from '@/dto/types';

/*
 * Response返回码
 */
export class Dto {
  public code: string | number;
  public result: any;
  public msg?: string;

  constructor({ code, result, msg }: DtoInput) {
    this.code = code;
    this.msg = msg;
    this.result = result;
  }
}

/*
 * ctx额外参数设置
 */
export class DtoCtxExtend<T = any, Q = any> {
  public params?: T;
  public payload?: Q;

  constructor({ params, payload }) {
    if (!!params) this.setParams(params);
    if (!!payload) this.setPayload(payload);
  }

  setParams(params: T) {
    this.params = params;
  }

  setPayload(payload: Q) {
    this.payload = payload;
  }
}
