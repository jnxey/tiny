import { ControllerOptions } from '@/controller/types';
import { JwtOptions } from '@/jwt/types';
import { ParamsOptions } from '@/params/types';

export type Constructor<T = any> = {
  new (...args: any[]): T;
};

export interface InitOptions {
  controller?: ControllerOptions;
  jwt?: JwtOptions;
  params?: ParamsOptions;
}
