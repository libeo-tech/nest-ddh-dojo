import { Injectable } from '@nestjs/common';
import { BasePorts } from '../../../common/core/domain/base.ports';
import { PrismaService } from '../../../prisma/prisma.service';
import { Hero } from '../../core/domain/hero.entity';
import { mapHeroOrmEntityToHeroEntity } from './hero.orm-mapper';

@Injectable()
export class HeroAdapter implements BasePorts<Hero> {
  constructor(private prisma: PrismaService) {}

  async getById(id: Hero['id']): Promise<Hero> {
    const hero = await this.prisma.hero.findFirst({ where: { id } });

    return mapHeroOrmEntityToHeroEntity(hero);
  }

  async getAll(): Promise<Hero[]> {
    const heroes = await this.prisma.hero.findMany();

    return heroes.map(mapHeroOrmEntityToHeroEntity);
  }

  async create(properties: Omit<Hero, 'id'>): Promise<Hero> {
    const hero = await this.prisma.hero.create({
      data: properties,
    });

    return mapHeroOrmEntityToHeroEntity(hero);
  }

  async update(entityId: Hero['id'], properties: Partial<Hero>): Promise<Hero> {
    const hero = await this.prisma.hero.update({
      where: { id: entityId },
      data: properties,
    });

    return mapHeroOrmEntityToHeroEntity(hero);
  }

  async delete(id: Hero['id']): Promise<void> {
    await this.prisma.hero.delete({ where: { id } });
  }
}
