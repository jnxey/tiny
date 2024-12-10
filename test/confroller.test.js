import { Get, Json, Params, ParamsSource, Result, Summary } from '../lib/tiny.js';
import { HomeIndexInput } from './model.test.js';

export class Home {
  @Get()
  @Json()
  @Params(HomeIndexInput, ParamsSource.body)
  @Summary('Describe')
  index(ctx, next) {
    //
  }
}
