export type JwtOptionsContext = <HandlerArgs, Context>(args: HandlerArgs) => Context | HandlerArgs;

export type JwtOptionsRefuse = <HandlerArgs, RefuseResult>(args: HandlerArgs) => RefuseResult | HandlerArgs;

export type JwtOptionsSign = <Context, Payload, Token = string>(context: Context, payload: Payload) => Token | null;

export type JwtOptionsVerify = <Context, VerifyResult>(context: Context) => VerifyResult | null;

export type JwtOptionsIsResetToken = <Payload>(payload: Payload) => boolean;

export type JwtOptions = {
  context?: JwtOptionsContext;
  refuse?: JwtOptionsRefuse;
  verify?: JwtOptionsVerify;
  sign?: JwtOptionsSign;
  isResetToken?: JwtOptionsIsResetToken;
};
