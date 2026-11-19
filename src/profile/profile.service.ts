import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  getProfile(select: Prisma.ProfileSelect, id?: number) {
    return this.prisma.profile.findFirst({
      where: id === undefined ? undefined : { id },
      select,
    });
  }
}
