import { FunctionArgs } from '@/types';

export type JwtOptionsSign = <Payload, Token>(args: FunctionArgs, payload: Payload) => Promise<Token | null>;

export type JwtOptionsVerify = <Payload>(args: []) => Promise<Payload | null>;

export type JwtOptionsInject = <Payload>(args: FunctionArgs, payload: Payload) => FunctionArgs;

export type JwtOptionsRefuse = <RefuseResult>(args: FunctionArgs) => RefuseResult | null;

export type JwtOptionsIsResetToken = <Payload>(payload: Payload) => boolean;

export type JwtOptions = {
  refuse?: JwtOptionsRefuse;
  verify?: JwtOptionsVerify;
  sign?: JwtOptionsSign;
  isResetToken?: JwtOptionsIsResetToken;
};
