import { MethodType } from '@/values';

export type RouterApiJson = {
  module: string;
  describe?: string;
  func: string;
  path: string;
  method: string;
  requestType?: string;
  responseType?: string;
  summary?: string;
  paramsModel?: object;
  resultModel?: object;
};

type RouteItem = { path: string; method: MethodType; handler: Function };
type RouteValue = {
  REG: RouteItem[];
  [path: string]: RouteItem | RouteItem[];
};
export type RoutesList = {
  GET: RouteValue;
  POST: RouteValue;
  PUT: RouteValue;
  PATCH: RouteValue;
  DELETE: RouteValue;
};
