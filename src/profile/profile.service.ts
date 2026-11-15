import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  getProfile() {
    return this.prisma.profile.findFirst({
      include: {
        experience: { orderBy: { startDate: 'desc' } },
        skills: { include: { skill: true } },
        projects: { orderBy: { id: 'asc' } },
      },
    });
  }
}
