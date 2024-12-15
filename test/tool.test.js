import Tiny from '../lib/tiny.js';
import querystring from 'querystring';

const { DataType, MethodType } = Tiny;

/**
 *  Get JSON
 */
export function getJSON(value, def) {
  if (!value) return def;
  try {
    return JSON.parse(value);
  } catch (e) {
    return def;
  }
}

export function bodyHandler(context) {
  return new Promise((resolve) => {
    if (context.req.method !== MethodType.post && context.req.method !== MethodType.put) return resolve(context);
    const contentType = context.req.headers['content-type'] || DataType.json;
    let body = '';

    // Monitor data block reception events
    context.req.on('data', (chunk) => {
      body += chunk.toString(); // Convert the received data block into a string and accumulate it
    });

    // End of listening request event
    context.req.on('end', () => {
      if (contentType === DataType.json) {
        context.setBody(getJSON(body, { data: null }).data);
      } else if (contentType === DataType.formUrlencoded) {
        context.setBody(querystring.parse(body));
      } else {
        context.setBody(String(body));
      }
      resolve(context);
    });
  });
}

export function getCookie(req) {
  let cookies = req.headers.cookie || '';
  // 解析Cookie字符串（这是一个简单的解析示例，实际中可能需要更复杂的逻辑）
  const cookieArray = cookies.split('; ');
  const parsedCookies = {};
  for (let cookie of cookieArray) {
    const [name, ...valueParts] = cookie.split('=');
    const value = valueParts.join('='); // 处理包含'='的cookie值
    parsedCookies[name.trim()] = decodeURIComponent(value.trim());
  }
  return parsedCookies;
}
