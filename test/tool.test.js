import { DataType, MethodType } from '../lib/tiny.js';
import querystring from 'querystring';

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

export function bodyHandler(req, _, callback) {
  if (req.method !== MethodType.post && req.method !== MethodType.put) return callback(req, _);
  const contentType = req.headers['content-type'] || DataType.json;
  let body = '';

  // Monitor data block reception events
  req.on('data', (chunk) => {
    body += chunk.toString(); // Convert the received data block into a string and accumulate it
  });

  // End of listening request event
  req.on('end', () => {
    if (contentType === DataType.json) {
      req.body = getJSON(body, { data: null }).data;
    } else if (contentType === DataType.formUrlencoded) {
      req.body = querystring.parse(body);
    } else {
      req.body = String(body);
    }
    callback(req, _);
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
