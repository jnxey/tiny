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
  context.send(new Dto('middleware'));
  next();
}

export class Home extends Controller {
  static MODULE_DESCRIBE = 'Home Test';

  @Get()
  @Type()
  @Summary('Describe')
  get(context) {
    context.send(new Dto('get'));
  }

  @Post()
  @Type()
  post(context) {
    context.send(new Dto('post'));
  }

  @Put()
  @Type()
  put(context) {
    context.send(new Dto('put'));
  }

  @Delete()
  @Type()
  delete(context) {
    context.send(new Dto('delete'));
  }

  @Patch()
  @Type()
  patch(context) {
    context.send(new Dto('patch'));
  }

  @Get()
  @Type(DataType.text, DataType.json)
  type(context) {
    context.send(new Dto('type'));
  }

  @Get()
  @Type(DataType.text, DataType.json)
  @Middleware(execMiddleware)
  middleware(context) {}

  @Get()
  @Type(DataType.text, DataType.json)
  @Mapping('/home/mapping/:test')
  mapping(context) {
    context.send(new Dto(context.query?.test));
  }

  @Get()
  @Summary('Summary Test')
  summary(context) {
    context.send(new Dto('summary'));
  }

  @Post()
  @Type()
  @Params.in(HomeIndexInput, ParamsSource.body)
  params(context) {
    context.send(new Dto(context.params));
  }

  @Post()
  @Type()
  @Params.in(HomeIndexInput, ParamsSource.body)
  jwtSign(context) {
    const token = Jwt.sign(context, { id: 1, name: 'test' });
    context.send(new Dto(token));
  }

  @Post()
  @Type()
  @Protected()
  jwtVerify(context) {
    context.send(new Dto(context.payload));
  }
}
