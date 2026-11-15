import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Project } from './project.model.js';
import { ProjectService } from './project.service.js';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [Project], { description: 'Все проекты' })
  projects() {
    return this.projectService.findAll();
  }

  @Query(() => Project, { nullable: true, description: 'Проект по id' })
  project(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.findOne(id);
  }
}
