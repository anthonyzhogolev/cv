import { describe, expect, it, vi } from 'vitest';
import type { GraphQLResolveInfo } from 'graphql';
import { ProfileResolver } from './profile.resolver.js';
import { ProfileService } from './profile.service.js';

// Реальный PrismaSelect не поднимаем: в юнит-тесте важна только передача
// построенного select в сервис. Маппинг selection set -> select проверяется
// вручную в песочнице по логам prisma:query.
vi.mock('@paljs/plugins', () => ({
  PrismaSelect: class {
    readonly value = {
      select: {
        fullName: true,
        projects: { select: { name: true } },
      },
    };
  },
}));

describe('ProfileResolver', () => {
  it('passes the select built from info to the service', async () => {
    const profile = { id: 1, fullName: 'Иван Иванов' };
    const service = {
      getProfile: vi.fn().mockResolvedValue(profile),
    } as unknown as ProfileService;

    const resolver = new ProfileResolver(service);
    const info = {} as GraphQLResolveInfo;
    const result = await resolver.profile(info);

    expect(result).toEqual(profile);
    expect(service.getProfile).toHaveBeenCalledWith(
      {
        fullName: true,
        projects: { select: { name: true } },
      },
      undefined,
    );
  });
});
