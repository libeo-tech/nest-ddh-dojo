import { PrismaService } from '../../prisma/prisma.service';
import { Hero } from '../core/domain/hero.entity';
import { HeroAdapter } from './prisma/hero.adapter';

export const HeroInfrastructure = {
  providers: [PrismaService, { provide: Hero, useClass: HeroAdapter }],
};
