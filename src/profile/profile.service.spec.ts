import { describe, expect, it, vi } from 'vitest';
import { ProfileService } from './profile.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProfileService', () => {
  it('passes the selection set through to prisma', async () => {
    const profile = {
      id: 1,
      fullName: 'Иван Иванов',
      experience: [],
      skills: [],
      projects: [],
    };
    const prisma = {
      profile: { findFirst: vi.fn().mockResolvedValue(profile) },
    } as unknown as PrismaService;

    const service = new ProfileService(prisma);
    const select = {
      fullName: true,
      experience: { select: { company: true } },
      skills: { select: { level: true, skill: { select: { name: true } } } },
      projects: { select: { name: true } },
    };
    const result = await service.getProfile(select);

    expect(result).toEqual(profile);
    expect(prisma.profile.findFirst).toHaveBeenCalledWith({ select });
  });

  it('filters by id when it is provided', async () => {
    const profile = { id: 2, fullName: 'Пётр Петров' };
    const prisma = {
      profile: { findFirst: vi.fn().mockResolvedValue(profile) },
    } as unknown as PrismaService;

    const service = new ProfileService(prisma);
    const result = await service.getProfile({ fullName: true }, 2);

    expect(result).toEqual(profile);
    expect(prisma.profile.findFirst).toHaveBeenCalledWith({
      where: { id: 2 },
      select: { fullName: true },
    });
  });

  it('returns null when the profile does not exist', async () => {
    const prisma = {
      profile: { findFirst: vi.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;

    const service = new ProfileService(prisma);

    await expect(service.getProfile({ fullName: true })).resolves.toBeNull();
  });
});
