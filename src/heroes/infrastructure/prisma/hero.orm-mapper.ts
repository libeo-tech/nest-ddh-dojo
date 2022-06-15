import { Hero as HeroEntity } from '../../core/domain/hero.entity';
import { Hero as HeroOrmEntity, Prisma } from '@prisma/client';

export const mapHeroOrmEntityToHeroEntity = (
  heroOrmEntity: HeroOrmEntity,
): HeroEntity => {
  return {
    id: heroOrmEntity.id as HeroEntity['id'],
    currentHp: heroOrmEntity.currentHp,
    level: heroOrmEntity.level,
    name: heroOrmEntity.name,
    xp: heroOrmEntity.xp,
  };
};
