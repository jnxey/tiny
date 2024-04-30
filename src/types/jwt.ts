export type JwtOptions = {
  privateKey: string;
  algorithms: string[];
  tokenKey: string;
  expiresIn: string;
};

export type JwtOptionsInput = {
  privateKey?: string;
  algorithms?: string[];
  tokenKey?: string;
  expiresIn?: string;
};
