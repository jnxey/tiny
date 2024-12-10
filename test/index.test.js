import Tiny, { Controller, Jwt, StatusCode } from '../lib/tiny.js';
import jsonwebtoken from 'jsonwebtoken';
import Koa from 'koa';
import Router from '@koa/router';
import { koaBody } from 'koa-body';
import axios from 'axios';
import { Home } from './confroller.test.js';

const port = 10101;
const base = 'http://localhost:' + port;
const app = new Koa();
const router = new Router();
app.use(koaBody());

const output = (value) => value;

Tiny.init({
  controller: { prefix: '/api/', hump: false },
  jwt: { expiresIn: '4h', jsonwebtoken: jsonwebtoken }
});

Controller.connect(new Home(), router);

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(port);

const findFuncJson = (module, func) => {
  let result = null;
  Controller.APIS_JSON.forEach((item) => {
    if (item.module === module && item.func === func) result = item;
  });
  return result;
};

test('-----Tiny.init-----', () => {
  expect(output(Controller.options.prefix)).toBe('/api/');
  expect(output(Controller.options.hump)).toBe(false);
  expect(output(Jwt.options.expiresIn)).toBe('4h');
  expect(output(Jwt.options.jsonwebtoken)).toBe(jsonwebtoken);
});

test('-----Controller.connect-----', () => {
  const homeIndex = findFuncJson('home', 'get');
  expect(output(homeIndex?.path)).toBe('/api/home/get');
  expect(output(homeIndex?.method)).toBe('get');
  expect(output(homeIndex?.requestType)).toBe('application/json');
  expect(output(homeIndex?.responseType)).toBe('application/json');
  expect(output(homeIndex?.summary)).toBe('Describe');
});

test('-----Get-----', async () => {
  const res = await axios.get(base + '/api/home/get');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: 'get' });
});

test('-----Post-----', async () => {
  const res = await axios.post(base + '/api/home/post');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: 'post' });
});

test('-----Put-----', async () => {
  const res = await axios.put(base + '/api/home/put');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: 'put' });
});

test('-----Delete-----', async () => {
  const res = await axios.delete(base + '/api/home/delete');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: 'delete' });
});

test('-----Type-----', () => {
  const homeType = findFuncJson('home', 'type');
  expect(output(homeType?.requestType)).toBe('text/plain');
  expect(output(homeType?.responseType)).toBe('application/json');
});

afterAll(() => {
  server.close();
});
