import Tiny from '../lib/tiny.js';
import { getJSON } from './tool.test.js';

const { Jwt } = Tiny;

export function initTiny() {
  Jwt.init({
    sign: function (context, payload) {
      context.cookie.set('token', JSON.stringify(payload));
      return JSON.stringify(payload);
    },
    verify: function (context, next) {
      const token = context.cookie.get('token');
      if (token) {
        context.setPayload(getJSON(token));
        next(context);
      } else {
        Jwt.refuse(context);
      }
    }
  });
}
