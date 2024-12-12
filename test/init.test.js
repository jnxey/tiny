import { Controller, Jwt } from '../lib/tiny.js';
import { getCookie, getJSON } from './tool.test.js';

export function initTiny() {
  Controller.init({ prefix: '/api' });
  Jwt.init({
    sign: function (context, payload) {
      context.res.setHeader('Set-Cookie', [`token=${JSON.stringify(payload)}; HttpOnly; Secure`]);
      return JSON.stringify(payload);
    },
    verify: function (context, next) {
      const parsedCookies = getCookie(context.req);
      if (parsedCookies.token) {
        context.setPayload(getJSON(parsedCookies.token));
        next(context);
      } else {
        Jwt.refuse(context);
      }
    }
  });
}
