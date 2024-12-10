import { Delete, Dto, Get, Type, Params, ParamsSource, Post, Put, StatusCode, Summary, DataType, Handler, Mapping } from '../lib/tiny.js';
import { HomeIndexInput } from './model.test.js';

function execHandler(ctx, next) {
  ctx.body = new Dto({ code: StatusCode.success, result: 'handler', msg: 'success' });
  next();
}

export class Home {
  static MODULE_DESCRIBE = 'Home Test';

  @Get()
  @Type()
  @Summary('Describe')
  get(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'get', msg: 'success' });
    next();
  }

  @Post()
  @Type()
  post(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'post', msg: 'success' });
    next();
  }

  @Put()
  @Type()
  put(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'put', msg: 'success' });
    next();
  }

  @Delete()
  @Type()
  delete(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'delete', msg: 'success' });
    next();
  }

  @Get()
  @Type(DataType.text, DataType.json)
  type(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'type', msg: 'success' });
    next();
  }

  @Get()
  @Type(DataType.text, DataType.json)
  @Handler(execHandler)
  handler(ctx, next) {
    next();
  }

  @Get()
  @Type(DataType.text, DataType.json)
  @Mapping('/home/mapping/:test')
  mapping(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: ctx.params.test, msg: 'success' });
    next();
  }

  @Get()
  @Summary('Summary Test')
  summary(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'summary', msg: 'success' });
    next();
  }

  @Post()
  @Type()
  @Params(HomeIndexInput, ParamsSource.body)
  params(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'hello word', msg: 'success' });
    next();
  }
}
