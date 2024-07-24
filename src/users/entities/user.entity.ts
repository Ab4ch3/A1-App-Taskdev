import { baseEntity } from 'src/config/base.entity';
import { IUser } from 'src/interfaces/user.interfaces';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity extends baseEntity implements IUser {
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  age: number;
  @Column()
  email: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  role: string;
}
