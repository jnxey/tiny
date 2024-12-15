import Tiny from '../lib/tiny.js';
import { HomeIndexInput } from './model.test.js';

const {
  Delete,
  Get,
  Type,
  Params,
  ParamsSource,
  Post,
  Put,
  Patch,
  StatusCode,
  Summary,
  DataType,
  Middleware,
  Mapping,
  Dto,
  Jwt,
  Protected,
  Controller
} = Tiny;

function execMiddleware(context, next) {
  context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'middleware', msg: 'success' }));
  next();
}

export class Home extends Controller {
  static MODULE_DESCRIBE = 'Home Test';

  @Get()
  @Type()
  @Summary('Describe')
  get(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'get', msg: 'success' }));
  }

  @Post()
  @Type()
  post(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'post', msg: 'success' }));
  }

  @Put()
  @Type()
  put(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'put', msg: 'success' }));
  }

  @Delete()
  @Type()
  delete(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'delete', msg: 'success' }));
  }

  @Patch()
  @Type()
  patch(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'patch', msg: 'success' }));
  }

  @Get()
  @Type(DataType.text, DataType.json)
  type(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'type', msg: 'success' }));
  }

  @Get()
  @Type(DataType.text, DataType.json)
  @Middleware(execMiddleware)
  middleware(context) {}

  @Get()
  @Type(DataType.text, DataType.json)
  @Mapping('/home/mapping/:test')
  mapping(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: context.query?.test, msg: 'success' }));
  }

  @Get()
  @Summary('Summary Test')
  summary(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'summary', msg: 'success' }));
  }

  @Post()
  @Type()
  @Params.in(HomeIndexInput, ParamsSource.body)
  params(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: context.params, msg: 'success' }));
  }

  @Post()
  @Type()
  @Params.in(HomeIndexInput, ParamsSource.body)
  jwtSign(context) {
    const token = Jwt.sign(context, { id: 1, name: 'test' });
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: token, msg: 'success' }));
  }

  @Post()
  @Type()
  @Protected()
  jwtVerify(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: context.payload, msg: 'success' }));
  }
}
