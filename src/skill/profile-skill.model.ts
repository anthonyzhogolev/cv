import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillLevel } from '../generated/prisma/enums.js';
import { Skill } from './skill.model.js';

registerEnumType(SkillLevel, { name: 'SkillLevel' });

@ObjectType()
export class ProfileSkill {
  @Field(() => SkillLevel)
  level: SkillLevel;

  @Field(() => Skill)
  skill: Skill;
}
