import { ParamsType } from '@/values';
import { Constructor } from '@/types';

export type ModelResult = { valid: boolean; message: string; value?: any };

export type ModelConfig = {
  description?: string;
  required?: boolean;
  requiredMessage?: string;
  type?: ParamsType | Constructor;
  typeErrorMessage?: string;
  arrayType?: ParamsType | Constructor;
  arrayTypeErrorMessage?: string;
  arrayMaxLength?: number;
  arrayMaxLengthMessage?: string;
  stringRange?: number[];
  stringRangeMessage?: string;
  typeCustom?: <T>(value: T) => ModelResult;
};
