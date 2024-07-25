import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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
      throw new Error(e);
    }
  }

  async findAll(): Promise<UsersEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw new Error(e);
    }
  }

  async findUser(id: string): Promise<UsersEntity> {
    try {
      return this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .getOne();
    } catch (e) {
      throw new Error(e);
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
        return undefined;
      }

      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  async delete(id: string) {
    try {
      const user = await this.userRepository.delete(id);

      // if (user.deletedCount === 0) {
      //   return undefined;
      // }

      return user;
    } catch (e) {
      throw new Error(e);
    }
  }
}
