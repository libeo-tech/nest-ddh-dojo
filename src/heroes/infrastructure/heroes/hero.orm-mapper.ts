import { Hero as HeroEntity } from '../../core/domain/hero.entity';
import { Hero as HeroOrmEntity } from './hero.orm-entity';

export const mapHeroOrmEntityToHeroEntity = (
  heroOrmEntity: HeroOrmEntity,
): HeroEntity => {
  return {
    id: heroOrmEntity.id,
    level: +heroOrmEntity.level,
    name: heroOrmEntity.name,
  };
};
