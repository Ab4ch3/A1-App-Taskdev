import { baseEntity } from 'src/config/base.entity';
import { IProject } from 'src/interfaces/project.interfaces';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'projects' })
export class ProjectsEntity extends baseEntity implements IProject {
  @Column()
  name: string;
  @Column()
  description: string;
}
