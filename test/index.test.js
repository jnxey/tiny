import { Init, Controller, Jwt, MethodType, Router, StatusCode, ParamsSource } from '../lib/tiny.js';
import http from 'http';
import axios from 'axios';
import { Home } from './confroller.test.js';

const port = 10101;
const base = 'http://localhost:' + port;

const output = (value) => value;

Init({
  controller: { prefix: '/api' },
  jwt: {
    refuse: function (req, res) {
      res.writeHead(StatusCode.authError, { 'Content-Type': 'text/plain' });
      res.end('Auth Limit');
    },
    sign: function ([req, res], payload) {
      // Set Cookie
      res.setHeader('Set-Cookie', [`token=${JSON.stringify(payload)}; HttpOnly; Secure`]);
    },
    verify: function ([req, res]) {
      let cookies = req.headers.cookie || '';
      // 解析Cookie字符串（这是一个简单的解析示例，实际中可能需要更复杂的逻辑）
      const cookieArray = cookies.split('; ');
      const parsedCookies = {};
      for (let cookie of cookieArray) {
        const [name, ...valueParts] = cookie.split('=');
        const value = valueParts.join('='); // 处理包含'='的cookie值
        parsedCookies[name.trim()] = decodeURIComponent(value.trim());
      }
      if (parsedCookies.token) {
        return JSON.parse(parsedCookies.token);
      } else {
        return null;
      }
    }
  },
  params: {
    paramsIn: function ([req, res], source) {
      return source === ParamsSource.body ? req.body || {} : req.query || {};
    },
    paramsInFail: function ([req, res], source) {
      res.writeHead(StatusCode.paramsError, { 'Content-Type': 'text/plain' });
      res.end('Params Error');
    },
    inject: function ([req, res], params) {
      req.params = params;
    }
  }
});

Controller.connect(new Home());

// Create HTTP Server
const server = http.createServer((req, res) => {
  Router.run(req, res);
});

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

const findFuncJson = (module, func) => {
  let result = null;
  Controller.apisJSON.forEach((item) => {
    if (item.module === module && item.func === func) result = item;
  });
  return result;
};

test('-----Tiny.init-----', () => {
  expect(output(Controller.prefix)).toBe('/api');
});

test('-----Controller.connect-----', () => {
  const func = findFuncJson('home', 'get');
  expect(output(func?.path)).toBe('/api/home/get');
  expect(output(func?.method)).toBe('GET');
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
  const res = await axios.get(base + '/home/mapping/1234');
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

afterAll(() => server.close());
