import { Query, Resolver } from '@nestjs/graphql';
import { Experience } from './experience.model.js';
import { ExperienceService } from './experience.service.js';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @Query(() => [Experience], { description: 'Опыт работы, от нового к старому' })
  experiences() {
    return this.experienceService.findAll();
  }
}
