import Tiny, { Controller, Jwt } from 'tiny.js';
import jsonwebtoken from 'jsonwebtoken';
import Router from '@koa/router';
import { Home } from './confroller.test.js';

const router = new Router();

const output = (value) => value;

// 初始化配置
Tiny.init({
  controller: { prefix: '/api/', hump: true },
  jwt: { expiresIn: '4h', jsonwebtoken: jsonwebtoken }
});

Controller.connect(new Home(), router);

test('-----Tiny.init-----', () => {
  expect(output(Controller.options.prefix)).toBe('/api/');
  expect(output(Controller.options.hump)).toBe(true);
  expect(output(Jwt.options.expiresIn)).toBe('4h');
  expect(output(Jwt.options.jsonwebtoken)).toBe(jsonwebtoken);
});

test('-----Controller.connect-----', () => {
  console.log(Controller.apiInfoJson);
  expect(output(Controller.apiInfoJson)).toBe(['/api/home/index']);
});
