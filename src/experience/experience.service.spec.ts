import { describe, expect, it, vi } from 'vitest';
import { ExperienceService } from './experience.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ExperienceService', () => {
  it('returns all experience entries ordered by start date descending', async () => {
    const entries = [{ id: 2 }, { id: 1 }];
    const prisma = {
      experience: { findMany: vi.fn().mockResolvedValue(entries) },
    } as unknown as PrismaService;

    const service = new ExperienceService(prisma);
    const result = await service.findAll();

    expect(result).toEqual(entries);
    expect(prisma.experience.findMany).toHaveBeenCalledWith({
      orderBy: { startDate: 'desc' },
    });
  });
});
