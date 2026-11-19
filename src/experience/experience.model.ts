import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Project } from '../project/project.model.js';

@ObjectType()
export class Experience {
  @Field(() => Int)
  id: number;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  description: string;

  @Field()
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'null означает «по настоящее время»',
  })
  endDate: Date | null;

  @Field(() => [Project])
  projects: Project[];
}
