import Tiny from '../lib/tiny.js';

const { Model, Declare, Required, TypeCheck, ParamsType, ArrayCheck } = Tiny;

export class HomeIndexInput extends Model {
  @Declare()
  @Required('id can not be empty')
  @TypeCheck(ParamsType.number, 'id can only be a number')
  id;

  @Declare()
  @Required('name can not be empty')
  @TypeCheck(ParamsType.string, 'name can only be a string')
  name;

  @Declare()
  @Required('list can not be empty')
  @TypeCheck(ParamsType.array, 'list can only be a array')
  @ArrayCheck(ParamsType.string, 'array content can only be a string')
  list;
}
