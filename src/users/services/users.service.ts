import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async create(newUser: CreateUserDto): Promise<UsersEntity> {
    try {
      return await this.userRepository.save(newUser);
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async findAll(): Promise<UsersEntity[]> {
    try {
      const users: UsersEntity[] = await this.userRepository.find();

      if (users.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Not Found users',
        });
      }

      return users;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async findUser(id: string): Promise<UsersEntity> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .getOne();
      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Not Found user',
        });
      }
      return user;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async update(
    id: string,
    updateUser: UpdateUserDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const user: UpdateResult = await this.userRepository.update(
        id,
        updateUser,
      );

      if (user.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not Updated user',
        });
      }

      return user;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async delete(id: string): Promise<DeleteResult | undefined> {
    try {
      const user: DeleteResult = await this.userRepository.delete(id);

      if (user.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not Delete user',
        });
      }

      return user;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }
}
