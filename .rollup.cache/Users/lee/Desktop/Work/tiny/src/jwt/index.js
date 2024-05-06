import { isObject, syncObjectData } from '@/tools';
import jsonwebtoken from 'jsonwebtoken';
import { StatusCode } from '@/values';
/// Jwt构造函数
export class Jwt {
    /*
     * 初始化jwt配置
     */
    static init(options) {
        if (isObject(options))
            syncObjectData(Jwt.options, options);
    }
    /*
     * 验证token
     */
    static verify(ctx) {
        const token = Jwt.options.getToken(ctx);
        if (!token)
            return null;
        try {
            return jsonwebtoken.verify(token, Jwt.options.privateKey);
        }
        catch (err) {
            return null;
        }
    }
    /*
     * 生成token
     */
    static sign(ctx, payload) {
        const token = jsonwebtoken.sign(payload, Jwt.options.privateKey, {
            algorithm: Jwt.options.algorithms,
            expiresIn: Jwt.options.expiresIn
        });
        Jwt.options.setToken(ctx, token);
        return token;
    }
}
Jwt.options = {
    privateKey: 'shared-secret',
    algorithms: 'HS256',
    expiresIn: '4h',
    ignoreExpiration: false,
    errorCode: StatusCode.authError,
    tokenKey: 'token',
    getToken: function (ctx) {
        return ctx.cookies.get(Jwt.options.tokenKey);
    },
    setToken: function (ctx, value) {
        return ctx.cookies.set(Jwt.options.tokenKey, value);
    }
};
/*
 * JWT装饰器-保护
 */
export function Protected() {
    return function (target, propertyKey, descriptor) {
        const func = descriptor.value;
        descriptor.value = function () {
            const args = arguments;
            const ctx = args[0];
            const next = args[1];
            const payload = Jwt.verify(ctx);
            if (payload) {
                ctx.payload = payload;
                return func.apply(this, args);
            }
            else {
                ctx.req.statusCode = Jwt.options.errorCode;
                return next();
            }
        };
    };
}
