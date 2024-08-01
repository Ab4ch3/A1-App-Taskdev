import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectRepository: Repository<ProjectsEntity>,
  ) {}
  async create(newProject: CreateProjectDto): Promise<ProjectsEntity> {
    try {
      return await this.projectRepository.save(newProject);
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async findAll(): Promise<ProjectsEntity[]> {
    try {
      const projects: ProjectsEntity[] = await this.projectRepository.find();

      if (projects.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Not Found projects',
        });
      }

      return projects;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async findProject(id: string): Promise<ProjectsEntity> {
    try {
      const project: ProjectsEntity = await this.projectRepository
        .createQueryBuilder('project')
        .where({ id })
        .getOne();

      if (!project) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Not Found project',
        });
      }
      return project;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async update(
    id: string,
    updateProject: UpdateProjectDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const project: UpdateResult = await this.projectRepository.update(
        id,
        updateProject,
      );

      if (project.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not Updated project',
        });
      }

      return project;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  async remove(id: string): Promise<DeleteResult | undefined> {
    try {
      const project: DeleteResult = await this.projectRepository.delete(id);

      if (project.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not Delete project',
        });
      }

      return project;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }
}
