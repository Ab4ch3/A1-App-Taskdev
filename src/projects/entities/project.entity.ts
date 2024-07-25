import { Column, Entity, OneToMany } from 'typeorm';
import { UsersProjectsEntity } from '../..//users/entities/userProjects.entity';
import { BaseEntity } from '../../config/base.entity';
import { IProject } from '../../interfaces/project.interfaces';

@Entity({ name: 'projects' })
export class ProjectsEntity extends BaseEntity implements IProject {
  @Column()
  name: string;
  @Column()
  description: string;

  @OneToMany(() => UsersProjectsEntity, (usersProject) => usersProject.project)
  usersIncludes: UsersProjectsEntity[];
}
