import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ErrorManager } from 'src/utils/error.manager';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserToProjectDTO } from '../dto/userToProject.dto';
import { UsersEntity } from '../entities/user.entity';
import { UsersProjectsEntity } from '../entities/userProjects.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(UsersProjectsEntity)
    private readonly userProjectRepository: Repository<UsersProjectsEntity>,
  ) {}

  async create(newUser: CreateUserDto): Promise<UsersEntity> {
    try {
      newUser.password = await bcrypt.hash(
        newUser.password,
        +process.env.HASH_SALT,
      );
      return await this.userRepository.save(newUser);
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async joinToProject(user: UserToProjectDTO) {
    try {
      return await this.userProjectRepository.save(user);
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
        .leftJoinAndSelect('user.projectsIncludes', 'projectsIncludes')
        .leftJoinAndSelect('projectsIncludes.project', 'project')
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
  async findBy({ key, value }: { key: keyof CreateUserDto; value: any }) {
    try {
      const user: UsersEntity = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne();

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
