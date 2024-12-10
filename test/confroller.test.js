import { Delete, Dto, Get, Type, Params, ParamsSource, Post, Put, StatusCode, Summary, DataType } from '../lib/tiny.js';
import { HomeIndexInput } from './model.test.js';

function jsonHandler(ctx, next) {
  // ctx.
}

export class Home {
  static DESCRIBE = 'HOME TEST';

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

  @Post()
  @Type()
  @Params(HomeIndexInput, ParamsSource.body)
  params(ctx, next) {
    ctx.body = new Dto({ code: StatusCode.success, result: 'hello word', msg: 'success' });
    next();
  }
}
