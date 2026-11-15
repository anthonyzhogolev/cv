import { describe, expect, it, vi } from 'vitest';
import { ProfileService } from './profile.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProfileService', () => {
  it('returns the profile with experience, skills and projects included', async () => {
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
    const result = await service.getProfile();

    expect(result).toEqual(profile);
    expect(prisma.profile.findFirst).toHaveBeenCalledWith({
      include: {
        experience: { orderBy: { startDate: 'desc' } },
        skills: { include: { skill: true } },
        projects: { orderBy: { id: 'asc' } },
      },
    });
  });

  it('returns null when the profile does not exist', async () => {
    const prisma = {
      profile: { findFirst: vi.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;

    const service = new ProfileService(prisma);

    await expect(service.getProfile()).resolves.toBeNull();
  });
});
