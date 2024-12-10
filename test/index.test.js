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
const router = new Router({ prefix: '/users' });
app.use(koaBody());
router.prefix('/api');

const output = (value) => value;

Tiny.init({
  controller: { hump: false },
  jwt: { expiresIn: '4h', jsonwebtoken: jsonwebtoken }
});

Controller.connect(new Home(), router);

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(port);

// console.log(Controller.APIS_JSON);

const findFuncJson = (module, func) => {
  let result = null;
  Controller.APIS_JSON.forEach((item) => {
    if (item.module === module && item.func === func) result = item;
  });
  return result;
};

test('-----Tiny.init-----', () => {
  expect(output(Controller.options.hump)).toBe(false);
  expect(output(Jwt.options.expiresIn)).toBe('4h');
  expect(output(Jwt.options.jsonwebtoken)).toBe(jsonwebtoken);
});

test('-----Controller.connect-----', () => {
  const func = findFuncJson('home', 'get');
  expect(output(func?.path)).toBe('/api/home/get');
  expect(output(func?.method)).toBe('get');
  expect(output(func?.requestType)).toBe('application/json');
  expect(output(func?.responseType)).toBe('application/json');
  expect(output(func?.summary)).toBe('Describe');
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
  const func = findFuncJson('home', 'type');
  expect(output(func?.requestType)).toBe('text/plain');
  expect(output(func?.responseType)).toBe('application/json');
});

test('-----Handler-----', async () => {
  const res = await axios.get(base + '/api/home/handler');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: 'handler' });
});

test('-----Mapping-----', async () => {
  const res = await axios.get(base + '/api/home/mapping/1234');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: '1234' });
});

test('-----Summary-----', async () => {
  const func = findFuncJson('home', 'summary');
  expect(output(func.summary)).toBe('Summary Test');
  const res = await axios.get(base + '/api/home/summary');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: 'summary' });
});

afterAll(() => {
  server.close();
});
