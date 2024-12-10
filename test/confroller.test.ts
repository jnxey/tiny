import { Get, Json, Params, ParamsSource, Result, Summary } from 'tiny.js';
import { HomeIndexInput } from './model.test';

export class Home {
  @Get()
  @Json()
  @Params(HomeIndexInput, ParamsSource.body)
  @Summary('Describe')
  index(ctx, next) {
    //
  }
}
