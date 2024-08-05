import { ROLES } from 'src/constants/roles';

export interface IPayloadToken {
  role: ROLES;
  sub: string;
}

export interface IAuthBody {
  username: string;
  password: string;
}

export interface IAuthTokenResult {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface IUseToken {
  role: string;
  sub: string;
  isExpired: boolean;
}
