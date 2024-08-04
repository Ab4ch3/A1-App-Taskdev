import { ROLES } from 'src/constants/roles';

export interface IPayloadToken {
  role: ROLES;
  sub: string;
}

export interface IAuthBody {
  username: string;
  password: string;
}
