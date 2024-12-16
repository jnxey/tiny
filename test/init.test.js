import Tiny from '../lib/tiny.js';
import { getJSON } from './tool.test.js';

const { Jwt } = Tiny;

export function initTiny() {
  Jwt.sign = function (context, payload) {
    context.cookie.set('token', JSON.stringify(payload));
    return JSON.stringify(payload);
  };
  Jwt.verify = function (context, next) {
    const token = context.cookie.get('token');
    if (token) {
      context.setPayload(getJSON(token));
      next();
    } else {
      Jwt.refuse(context);
    }
  };
}
