import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  techStack: string[];

  @Field(() => String, { nullable: true })
  repoUrl: string | null;

  @Field(() => String, { nullable: true })
  demoUrl: string | null;
}
