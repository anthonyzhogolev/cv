import { describe, expect, it, vi } from 'vitest';
import { ProjectService } from './project.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProjectService', () => {
  it('returns all projects', async () => {
    const projects = [{ id: 1 }, { id: 2 }];
    const prisma = {
      project: {
        findMany: vi.fn().mockResolvedValue(projects),
        findUnique: vi.fn(),
      },
    } as unknown as PrismaService;

    const service = new ProjectService(prisma);

    await expect(service.findAll()).resolves.toEqual(projects);
    expect(prisma.project.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
    });
  });

  it('finds a project by id', async () => {
    const project = { id: 7, name: 'Цифровая визитка' };
    const prisma = {
      project: {
        findMany: vi.fn(),
        findUnique: vi.fn().mockResolvedValue(project),
      },
    } as unknown as PrismaService;

    const service = new ProjectService(prisma);

    await expect(service.findOne(7)).resolves.toEqual(project);
    expect(prisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 7 } });
  });

  it('returns null for a missing project', async () => {
    const prisma = {
      project: {
        findMany: vi.fn(),
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as unknown as PrismaService;

    const service = new ProjectService(prisma);

    await expect(service.findOne(999)).resolves.toBeNull();
  });
});
