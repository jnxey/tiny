import { Init, Controller, Router, StatusCode, ParamsSource, MethodType } from '../lib/tiny.js';
import http from 'http';
import axios from 'axios';
import { Home } from './confroller.test.js';
import { bodyHandler, getCookie } from './tool.test.js';

const port = 10101;
const base = 'http://localhost:' + port;

const output = (value) => value;

Init({
  controller: {
    prefix: '/api',
    get: Router.getRouteController(MethodType.get),
    post: Router.getRouteController(MethodType.post),
    delete: Router.getRouteController(MethodType.delete),
    put: Router.getRouteController(MethodType.put)
  },
  jwt: {
    refuse: function ([req, res]) {
      res.writeHead(StatusCode.authError, { 'Content-Type': 'text/plain' });
      res.end('Auth Limit');
    },
    sign: function ([req, res], payload) {
      // Set Cookie
      res.setHeader('Set-Cookie', [`token=${JSON.stringify(payload)}; HttpOnly; Secure`]);
      return Promise.resolve(JSON.stringify(payload));
    },
    verify: function ([req, _]) {
      const parsedCookies = getCookie(req);
      if (parsedCookies.token) {
        return Promise.resolve(JSON.parse(parsedCookies.token));
      } else {
        return Promise.resolve(null);
      }
    },
    inject: function ([req, res], payload) {
      req.payload = payload;
      return [req, res];
    }
  },
  params: {
    paramsIn: function ([req, res], source) {
      return source === ParamsSource.body ? req.body || {} : req.query || {};
    },
    paramsInFail: function ([req, res]) {
      res.writeHead(StatusCode.paramsError, { 'Content-Type': 'text/plain' });
      res.end('Params Error');
    },
    inject: function ([req, res], params) {
      req.params = params;
      return [req, res];
    }
  }
});

Controller.connect(new Home());

// Create HTTP Server
const server = http.createServer((req, res) => {
  bodyHandler(req, res, () => {
    Router.run(req, res);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

// console.log(Controller.apisJSON, '---------1');

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

test('-----Params-1-----', async () => {
  const data = { id: 1, name: 'test', list: ['12', '23'] };
  const res = await axios.post(base + '/api/home/params', { data: data });
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: data });
});

test('-----Params-2-----', () => {
  const data = { id: 1, name: 'test', list: ['12', '23'] };
  try {
    axios
      .post(base + '/api/home/params', { data: { data, list: [1, 2, 3] } })
      .then((res) => {
        expect(output(res.status)).toBe(StatusCode.paramsError);
      })
      .catch((e) => {});
  } catch (e) {}
});

test('-----Params-3-----', () => {
  const data = { id: 1, name: 'test', list: ['12', '23'] };
  try {
    axios
      .post(base + '/api/home/params', { data: { data, id: '1' } })
      .then((res) => {
        expect(output(res.status)).toBe(StatusCode.paramsError);
      })
      .catch((e) => {});
  } catch (e) {}
});

test('-----Params-4-----', () => {
  const data = { id: 1, name: 'test', list: ['12', '23'] };
  try {
    axios
      .post(base + '/api/home/params', { data: { data, name: 1 } })
      .then((res) => {
        expect(output(res.status)).toBe(StatusCode.paramsError);
      })
      .catch((e) => {});
  } catch (e) {}
});

test('-----Router-----', () => {
  try {
    axios
      .get(base + '/api/home/not-found')
      .then((res) => {
        expect(output(res.status)).toBe(StatusCode.paramsError);
      })
      .catch((e) => {});
  } catch (e) {}
});

afterAll(() => server.close());
