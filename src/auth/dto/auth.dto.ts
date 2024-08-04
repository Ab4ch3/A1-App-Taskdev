import { IsNotEmpty, IsString } from 'class-validator';
import { IAuthBody } from 'src/interfaces/auth.interfaces';

export class AuthDto implements IAuthBody {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
