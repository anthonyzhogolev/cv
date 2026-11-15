import { describe, expect, it, vi } from 'vitest';
import { ProfileResolver } from './profile.resolver.js';
import { ProfileService } from './profile.service.js';

describe('ProfileResolver', () => {
  it('delegates the profile query to the service', async () => {
    const profile = { id: 1, fullName: 'Иван Иванов' };
    const service = {
      getProfile: vi.fn().mockResolvedValue(profile),
    } as unknown as ProfileService;

    const resolver = new ProfileResolver(service);

    await expect(resolver.profile()).resolves.toEqual(profile);
    expect(service.getProfile).toHaveBeenCalledTimes(1);
  });
});
