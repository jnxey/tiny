import { DataType, MethodType, RouterNotFound, StatusCode } from '@/values';
import { isObject, parseRoute, syncObjectData } from '@/tools';
import url from 'url';
import { ContextBase } from '@/context/types';
import { RouterApiJson, RoutesList } from '@/router/types';
import { Controller } from '@/controller';
import { ConnectOptions } from '@/controller/types';

const SymbolParam = ':';

export class Router {
  public options: ConnectOptions = {
    prefix: '',
    format: true
  };

  /*
   * Route apiJSON
   */
  public apiJSON: RouterApiJson[] = [];

  /*
   * Route list
   */
  public routes: RoutesList = {
    GET: { REG: [] },
    POST: { REG: [] },
    PUT: { REG: [] },
    PATCH: { REG: [] },
    DELETE: { REG: [] }
  };

  /*
   * Get Route list
   */
  _getRoutes = (method?: string) => {
    return this.routes[method || MethodType.get] || { REG: [] };
  };

  /*
   * Set Route prefix
   */
  public config = (options: ConnectOptions) => {
    syncObjectData(this.options, options);
  };

  /*
   * Trigger 404
   */
  public notFound = (context: ContextBase) => {
    context.send<string>(RouterNotFound, StatusCode.notFound, DataType.text);
  };

  /*
   * Server run
   */
  public work = (context: ContextBase) => {
    const parsedUrl = url.parse(context.req.url ?? '', true);
    const routes = this._getRoutes(context.req.method);
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
      return this.notFound(context);
    }
  };

  /*
   * Register Route
   */
  public register = (controller: Controller) => {
    const connects = controller.connect(this.options);
    connects.forEach(({ path, method, handler, options }) => {
      if (path.indexOf(SymbolParam) > -1) {
        this.routes[method].REG.push({ path, method, handler });
      } else {
        this.routes[method][path] = { path, method, handler };
      }
      this.apiJSON.push(options);
    });
  };
}
