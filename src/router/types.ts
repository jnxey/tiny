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
