import Tiny, { Controller, Jwt } from '../lib/tiny.js';
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
  expect(output(Controller.apiInfoJson[0]?.module)).toBe('Home');
  expect(output(Controller.apiInfoJson[0]?.func)).toBe('index');
  expect(output(Controller.apiInfoJson[0]?.path)).toBe('/api/Home/index');
  expect(output(Controller.apiInfoJson[0]?.method)).toBe('get');
  expect(output(Controller.apiInfoJson[0]?.dataType)).toBe('application/json');
  expect(output(Controller.apiInfoJson[0]?.summary)).toBe('Describe');
});
