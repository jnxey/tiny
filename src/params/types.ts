export type ParamsOptionsContext = <HandlerArgs, Context>(args: HandlerArgs) => Context | HandlerArgs;
export type ParamsOptionsHandlerIn = <HandlerArgs, Context>(path: string, handler: Function, middleware?: Function) => void;
export type ParamsOptionsHandlerFail = <HandlerArgs, Context>(path: string, handler: Function, middleware?: Function) => void;

export type ParamsOptions = {
  context?: ParamsOptionsContext;
  handlerIn?: ParamsOptionsHandlerIn;
  handlerFail?: ParamsOptionsHandlerFail;
};
