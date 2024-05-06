/*
 * Response返回码
 */
export class Dto {
    constructor({ code, result, msg }) {
        this.code = code;
        this.msg = msg;
        this.result = result;
    }
}
