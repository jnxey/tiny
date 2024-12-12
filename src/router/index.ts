import { ServerResponse } from 'http';
import { DataType, MethodType } from '@/values';
import { getJSON, isFunction, isObject, parseRoute } from '@/tools';
import { RouterRequest } from '@/router/types';
import querystring from 'querystring';

const SymbolParam = ':';
type RouteItem = { path: string; method: MethodType; handler: Function };
interface RoutesList {
  [name: string]: { REG: RouteItem[] };
}

export class Router {
  /*
   * Route list
   */
  static Routes: RoutesList = {
    HEAD: { REG: [] },
    OPTIONS: { REG: [] },
    GET: { REG: [] },
    POST: { REG: [] },
    PUT: { REG: [] },
    DELETE: { REG: [] }
  };

  /*
   * Get Route list
   */
  static getRoutes = (method?: string) => {
    return Router.Routes[method || MethodType.get] || { REG: [] };
  };

  /*
   * Trigger 404
   */
  static notFound = (_, res: ServerResponse) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  };

  /*
   * Handler body
   */
  static otherBody = (req: RouterRequest, _) => {
    // ToDo
  };

  /*
   * Handler body
   */
  static body = (req: RouterRequest, _) => {
    const contentType = req.headers['content-type'];
    let body = '';
    // Monitor data block reception events
    req.on('data', (chunk) => {
      body += chunk.toString(); // Convert the received data block into a string and accumulate it
    });

    // End of listening request event
    req.on('end', () => {
      if (contentType === DataType.json) {
        req.body = getJSON(body);
      } else if (contentType === DataType.text || contentType === DataType.html || contentType === DataType.xml) {
        req.body = body;
      } else if (contentType === DataType.formUrlencoded) {
        req.body = querystring.parse(body);
      }
    });

    Router.otherBody(req, _);
  };

  /*
   * Server run
   */
  static run = (req: RouterRequest, res: ServerResponse, bodyHandler?: Function) => {
    if (!!bodyHandler) bodyHandler(req, res);
    const host = 'http://127.0.0.1';
    const url = new URL(req.url || '', host);
    const routes = Router.getRoutes(req.method);
    const route = routes[url.pathname];
    req.query = url.searchParams;
    if (!!route) {
      return route.handler(req, res);
    } else {
      for (let i = 0; i < routes.REG.length; i++) {
        const _route = routes.REG[i];
        const params = parseRoute(url.pathname, _route.path);
        if (isObject(params)) {
          req.query = { ...req.query, ...params };
          return _route.handler(req, res);
        }
      }

      Object.keys(routes.REG).forEach((path) => {});
      return Router.notFound(req, res);
    }
  };

  /*
   * Register Route
   */
  static register = (path: string, method: MethodType, handler: Function) => {
    if (path.indexOf(SymbolParam) > -1) {
      Router.Routes[method].REG.push({ path, method, handler });
    } else {
      Router.Routes[method][path] = { path, method, handler };
    }
  };
}
