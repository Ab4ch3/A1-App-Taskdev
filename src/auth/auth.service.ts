import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IPayloadToken } from 'src/interfaces/auth.interfaces';
import { UsersEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersServices: UsersService) {}
  /**
   * ValidateUser
   */

  public async validateUser(username: string, password: string) {
    /* 
      Queremos que se pueda validar de dos maneras , por el username
      o por el email del usuario
    */
    const userByUsername = await this.usersServices.findBy({
      key: 'username',
      value: username,
    });
    const userByEmail = await this.usersServices.findBy({
      key: 'email',
      value: username,
    });

    if (userByUsername) {
      const match = await bcrypt.compare(password, userByUsername.password);

      if (match) {
        return userByUsername;
      }
    }

    if (userByEmail) {
      const match = await bcrypt.compare(password, userByEmail.password);
      if (match) {
        return userByEmail;
      }
    }

    return null;
  }

  /**
   *
   * @param param0
   * @returns
   */
  public async singJWT({
    payload,
    secrect,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secrect: string;
    expires: number | string;
  }) {
    return jwt.sign(payload, secrect, { expiresIn: expires });
  }

  /**
   *
   * @param user
   * @returns
   */
  public async generateJWT(user: UsersEntity): Promise<any> {
    const getUser = await this.usersServices.findUser(user.id);

    const payload: IPayloadToken = {
      role: getUser.role,
      sub: getUser.id,
    };

    return {
      access_token: await this.singJWT({
        payload,
        secrect: process.env.JWT_SECRET,
        expires: '1h',
      }),
      user,
    };
  }
}
