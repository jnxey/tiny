import { StatusCode } from '@/values';

/*
 * Response Dto
 */
export class Dto {
  public code: number;
  public result: any;
  public msg?: string;

  constructor(result: any, code: number = StatusCode.success, msg?: string) {
    this.code = code;
    this.msg = msg;
    this.result = result;
  }

  toString() {
    return JSON.stringify(this);
  }
}
