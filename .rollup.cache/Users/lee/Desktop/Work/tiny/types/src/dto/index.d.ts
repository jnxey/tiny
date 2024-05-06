import { DtoInput } from '@/types/dto';
export declare class Dto {
    code: string | number;
    result: any;
    msg?: string;
    constructor({ code, result, msg }: DtoInput);
}
