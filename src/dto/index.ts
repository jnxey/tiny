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
export class DtoCtxExtend<P1 = any, P2 = any> {
  public params!: P1;
  public payload!: P2;

  constructor({ params, payload }) {
    if (!!params) this.setParams(params);
    if (!!payload) this.setPayload(payload);
  }

  setParams(params: P1) {
    this.params = params;
  }

  setPayload(payload: P2) {
    this.payload = payload;
  }
}
