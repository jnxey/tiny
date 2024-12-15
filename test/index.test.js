import Tiny, { Router, StatusCode } from '../lib/tiny.js';
import axios from 'axios';
import { Home } from './confroller.test.js';
import { bodyHandler } from './tool.test.js';
import { initTiny } from './init.test.js';

const port = 10101;
const base = 'http://localhost:' + port;

const tiny = new Tiny();
const router = new Router();

tiny.begin = async (context, next) => {
  next();
};

tiny.run = async (context) => {
  await bodyHandler(context);
  router.run(context);
};

tiny.onerror = (err) => {
  console.log(err, '---------------------onerror');
};

initTiny();

const output = (value) => value;

router.config({ prefix: '/api' });
router.register(new Home());

const server = tiny.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

// console.log(router.apisJSON, '---------1');

const findFuncJson = (module, func) => {
  let result = null;
  router.ApiJSON.forEach((item) => {
    if (item.module === module && item.func === func) result = item;
  });
  return result;
};

test('-----Tiny.init-----', () => {
  expect(output(router.options.prefix)).toBe('/api');
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

test('-----Patch-----', async () => {
  const res = await axios.patch(base + '/api/home/patch');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: 'patch' });
});

test('-----Type-----', () => {
  const func = findFuncJson('home', 'type');
  expect(output(func?.requestType)).toBe('text/plain');
  expect(output(func?.responseType)).toBe('application/json');
});

test('-----Middleware-----', async () => {
  const res = await axios.get(base + '/api/home/middleware');
  expect(output(res.status)).toBe(StatusCode.success);
  expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: 'middleware' });
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

test('-----JWT sign-----', () => {
  try {
    axios
      .post(base + '/api/home/jwt-sign')
      .then((res) => {
        expect(output(res.status)).toBe(StatusCode.success);
        expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: JSON.stringify({ id: 1, name: 'test' }) });
      })
      .catch((e) => {});
  } catch (e) {}
});

test('-----JWT verify-----', () => {
  try {
    axios
      .post(base + '/api/home/jwt-verify')
      .then((res) => {
        expect(output(res.status)).toBe(StatusCode.success);
        expect(output(res.data)).toEqual({ code: 200, msg: 'success', result: { id: 1, name: 'test' } });
      })
      .catch((e) => {});
  } catch (e) {}
});

afterAll(() => server.close());
