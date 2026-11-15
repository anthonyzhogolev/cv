import { describe, expect, it, vi } from 'vitest';
import { SkillService } from './skill.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('SkillService', () => {
  it('returns the skill dictionary ordered by category and name', async () => {
    const skills = [{ id: 1, name: 'TypeScript' }];
    const prisma = {
      skill: { findMany: vi.fn().mockResolvedValue(skills) },
    } as unknown as PrismaService;

    const service = new SkillService(prisma);
    const result = await service.findAll();

    expect(result).toEqual(skills);
    expect(prisma.skill.findMany).toHaveBeenCalledWith({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  });
});
