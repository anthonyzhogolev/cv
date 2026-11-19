import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}
  
  findAll() {
    return this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }
}
