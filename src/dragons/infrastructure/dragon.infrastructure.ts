import { DragonAdapter } from './prisma/dragon.adapter';
import { Dragon } from '../core/domain/dragon.entity';
import { PrismaService } from '../../prisma/prisma.service';

export const DragonInfrastructure = {
  providers: [PrismaService, { provide: Dragon, useClass: DragonAdapter }],
};
