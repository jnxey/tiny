import { DtoInput } from '@/dto/types';

/*
 * Response Dto
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

  toString() {
    return JSON.stringify(this);
  }
}
