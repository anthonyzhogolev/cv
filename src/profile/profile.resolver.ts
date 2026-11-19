import { Args, Info, Int, Query, Resolver } from '@nestjs/graphql';
import { Profile } from './profile.model.js';
import { ProfileService } from './profile.service.js';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, {
    nullable: true,
    description: 'Визитка целиком: профиль, опыт, навыки и проекты',
  })
  profile(
    @Info() info: GraphQLResolveInfo,
    @Args('id', { type: () => Int, nullable: true }) id?: number,
  ) {
    const { select } = new PrismaSelect(info).value;
    return this.profileService.getProfile(select, id);
  }
}
