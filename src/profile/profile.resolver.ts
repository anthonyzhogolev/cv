import { Query, Resolver } from '@nestjs/graphql';
import { Profile } from './profile.model.js';
import { ProfileService } from './profile.service.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, {
    nullable: true,
    description: 'Визитка целиком: профиль, опыт, навыки и проекты',
  })
  profile() {
    return this.profileService.getProfile();
  }
}
