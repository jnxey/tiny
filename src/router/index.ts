import { ServerResponse } from 'http';
import { MethodType } from '@/values';
import { isObject, parseRoute } from '@/tools';
import { RouterRequest } from '@/router/types';
import { ControllerRouterFunc } from '@/controller/types';
import url from 'url';

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
   * Server run
   */
  static run = (req: RouterRequest, res: ServerResponse) => {
    const parsedUrl = url.parse(req.url ?? '', true);
    const routes = Router.getRoutes(req.method);
    const pathname = parsedUrl.pathname ?? '';
    const route = routes[pathname];
    req.query = parsedUrl.query;
    if (!!route) {
      return route.handler(req, res);
    } else {
      for (let i = 0; i < routes.REG.length; i++) {
        const _route = routes.REG[i];
        const params = parseRoute(pathname, _route.path);
        if (isObject(params)) {
          req.query = { ...parsedUrl.query, ...params };
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

  /*
   * Get default Controller Route
   */
  static getRouteController = (method: MethodType): ControllerRouterFunc => {
    return (path: string, handler: Function, middleware?: Function) => {
      Router.register(path, method, (req, res) => {
        if (middleware) middleware(req, res);
        handler(req, res);
      });
    };
  };
}
