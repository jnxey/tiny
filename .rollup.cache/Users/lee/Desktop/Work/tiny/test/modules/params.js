import { __decorate, __metadata } from "tslib";
import { Declare, Required, TypeError, ParamsModel } from '@/params';
import { ParamsType } from '@/values';
import { test } from 'jest-circus';
import { expect } from '@jest/globals';
class ParamsTest extends ParamsModel {
    constructor() {
        super(...arguments);
        this.test = ParamsModel.def.string;
        this.sct = ParamsModel.def.number;
    }
}
__decorate([
    Declare('测试描述1'),
    Required('不能为空'),
    TypeError(ParamsType.string, '类型错误'),
    __metadata("design:type", String)
], ParamsTest.prototype, "test", void 0);
__decorate([
    Declare('测试描述2'),
    TypeError(ParamsType.number, '类型错误2'),
    __metadata("design:type", Number)
], ParamsTest.prototype, "sct", void 0);
test('params生成', () => {
    const params = new ParamsTest();
    const result1 = params.fill({ test: 1, sct: 1 });
    const result2 = params.fill({ test: '1234', sct: '1234' });
    const result3 = params.fill({ sct: 1 });
    const result4 = params.fill({ test: '1234', sct: 1 });
    expect(params.test).toBe(3);
});
