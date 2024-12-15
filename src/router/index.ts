import { MethodType } from '@/values';
import { isObject, parseRoute } from '@/tools';
import { ControllerRouterFunc } from '@/controller/types';
import url from 'url';
import { ContextBase } from '@/context/types';

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
    PATCH: { REG: [] },
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
  static notFound = (context: ContextBase) => {
    context.res.writeHead(404, { 'Content-Type': 'text/plain' });
    context.res.end('404 Not Found');
  };

  /*
   * Server run
   */
  static run = (context: ContextBase) => {
    const parsedUrl = url.parse(context.req.url ?? '', true);
    const routes = Router.getRoutes(context.req.method);
    const pathname = parsedUrl.pathname ?? '';
    const route = routes[pathname];
    const query = parsedUrl.query || {};
    if (!!route) {
      context.setQuery(query);
      return route.handler(context);
    } else {
      for (let i = 0; i < routes.REG.length; i++) {
        const _route = routes.REG[i];
        const params = parseRoute(pathname, _route.path);
        if (isObject(params)) {
          context.setQuery({ ...query, ...params });
          return _route.handler(context);
        }
      }
      return Router.notFound(context);
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
    return (path: string, handler: Function) => {
      Router.register(path, method, handler);
    };
  };
}
