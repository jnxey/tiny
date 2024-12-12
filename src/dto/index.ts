import { DtoInput } from '@/dto/types';
import { ServerResponse } from 'http';
import { DataType, StatusCode } from '@/values';

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

  public static send(res: ServerResponse, params: DtoInput) {
    res.writeHead(StatusCode.success, { 'Content-Type': DataType.json });
    res.end(JSON.stringify(params));
  }

  value(params: DtoInput) {
    return JSON.stringify(params);
  }
}
