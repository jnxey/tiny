export type JwtOptionsArgs = any[] | IArguments;

export type JwtOptionsSign = <Payload, Token = string>(args: JwtOptionsArgs, payload: Payload) => Token | null;

export type JwtOptionsVerify = <VerifyResult>(args: JwtOptionsArgs) => VerifyResult | null;

export type JwtOptionsInject = <Payload>(args: JwtOptionsArgs, payload: Payload) => JwtOptionsArgs;

export type JwtOptionsRefuse = <RefuseResult>(args: JwtOptionsArgs) => RefuseResult | null;

export type JwtOptionsIsResetToken = <Payload>(payload: Payload) => boolean;

export type JwtOptions = {
  refuse?: JwtOptionsRefuse;
  verify?: JwtOptionsVerify;
  sign?: JwtOptionsSign;
  isResetToken?: JwtOptionsIsResetToken;
};
