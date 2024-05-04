import { ControllerOptionsInput } from '@/types/controller';
import { JwtOptionsInput } from '@/types/jwt';

export interface InitOptions {
  controller?: ControllerOptionsInput;
  jwt?: JwtOptionsInput;
}
