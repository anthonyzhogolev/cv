import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Experience } from '../experience/experience.model.js';
import { ProfileSkill } from '../skill/profile-skill.model.js';
import { Project } from '../project/project.model.js';

@ObjectType()
export class Profile {
  @Field(() => Int)
  id: number;

  @Field()
  fullName: string;

  @Field({ description: 'Должность / специализация' })
  title: string;

  @Field()
  bio: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  phone: string | null;

  @Field(() => String, { nullable: true })
  location: string | null;

  @Field(() => String, { nullable: true })
  github: string | null;

  @Field(() => String, { nullable: true })
  linkedin: string | null;

  @Field(() => String, { nullable: true })
  telegram: string | null;

  @Field(() => [Experience])
  experience: Experience[];

  @Field(() => [ProfileSkill])
  skills: ProfileSkill[];

  @Field(() => [Project])
  projects: Project[];
}
