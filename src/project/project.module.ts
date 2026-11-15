import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver.js';
import { ProjectService } from './project.service.js';

@Module({
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
