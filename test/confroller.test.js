import { Delete, Dto, Get, Type, Params, ParamsSource, Post, Put, StatusCode, Summary, DataType, Handler, Mapping } from '../lib/tiny.js';
import { HomeIndexInput } from './model.test.js';

function execHandler(req, res) {
  Dto.send(res, { code: StatusCode.success, result: 'handler', msg: 'success' });
}

export class Home {
  static MODULE_DESCRIBE = 'Home Test';

  @Get()
  @Type()
  @Summary('Describe')
  get(req, res) {
    Dto.send(res, { code: StatusCode.success, result: 'get', msg: 'success' });
  }

  @Post()
  @Type()
  post(req, res) {
    Dto.send(res, { code: StatusCode.success, result: 'post', msg: 'success' });
  }

  @Put()
  @Type()
  put(req, res) {
    Dto.send(res, { code: StatusCode.success, result: 'put', msg: 'success' });
  }

  @Delete()
  @Type()
  delete(req, res) {
    Dto.send(res, { code: StatusCode.success, result: 'delete', msg: 'success' });
  }

  @Get()
  @Type(DataType.text, DataType.json)
  type(req, res) {
    Dto.send(res, { code: StatusCode.success, result: 'type', msg: 'success' });
  }

  @Get()
  @Type(DataType.text, DataType.json)
  @Handler(execHandler)
  handler(req, res) {}

  @Get()
  @Type(DataType.text, DataType.json)
  @Mapping('/home/mapping/:test')
  mapping(req, res) {
    Dto.send(res, { code: StatusCode.success, result: req.query?.test, msg: 'success' });
  }

  @Get()
  @Summary('Summary Test')
  summary(req, res) {
    Dto.send(res, { code: StatusCode.success, result: 'summary', msg: 'success' });
  }

  @Post()
  @Type()
  @Params.in(HomeIndexInput, ParamsSource.body)
  params(req, res) {
    Dto.send(res, { code: StatusCode.success, result: req.params, msg: 'success' });
  }
}
