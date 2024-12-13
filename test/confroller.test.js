import { Delete, Get, Type, Params, ParamsSource, Post, Put, StatusCode, Summary, DataType, Middleware, Mapping, Dto } from '../lib/tiny.js';
import { HomeIndexInput } from './model.test.js';

function execMiddleware(context, next) {
  context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: 'middleware', msg: 'success' }));
  next();
}

export class Home {
  static MODULE_DESCRIBE = 'Home Test';

  @Get()
  @Type()
  @Summary('Describe')
  get(context) {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: 'get', msg: 'success' }));
  }

  @Post()
  @Type()
  post(context) {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: 'post', msg: 'success' }));
  }

  @Put()
  @Type()
  put(context) {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: 'put', msg: 'success' }));
  }

  @Delete()
  @Type()
  delete(context) {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: 'delete', msg: 'success' }));
  }

  @Get()
  @Type(DataType.text, DataType.json)
  type(context) {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: 'type', msg: 'success' }));
  }

  @Get()
  @Type(DataType.text, DataType.json)
  @Middleware(execMiddleware)
  middleware(context) {}

  @Get()
  @Type(DataType.text, DataType.json)
  @Mapping('/home/mapping/:test')
  mapping(context) {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: context.query?.test, msg: 'success' }));
  }

  @Get()
  @Summary('Summary Test')
  summary(context) {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: 'summary', msg: 'success' }));
  }

  @Post()
  @Type()
  @Params.in(HomeIndexInput, ParamsSource.body)
  params(context) {
    context.finish(StatusCode.success, new Dto({ code: StatusCode.success, result: context.params, msg: 'success' }));
  }
}
