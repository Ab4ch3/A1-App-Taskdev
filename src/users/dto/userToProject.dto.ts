import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { ProjectsEntity } from 'src/projects/entities/project.entity';
import { UsersEntity } from '../entities/user.entity';

export class UserToProjectDTO {
  @IsNotEmpty()
  @IsEnum(ACCESS_LEVEL)
  accessLevel: ACCESS_LEVEL;

  @IsNotEmpty()
  @IsUUID()
  user: UsersEntity;

  @IsOptional()
  @IsUUID()
  project: ProjectsEntity;
}
