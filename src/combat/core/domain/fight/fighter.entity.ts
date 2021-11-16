import { Dragon } from '../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../../heroes/core/domain/hero.entity';

export enum FighterType {
  HERO = 'HERO',
  DRAGON = 'DRAGON',
}

export type HeroFighter = {
  id: Hero['id'];
  type: FighterType.HERO;
};
export type DragonFighter = {
  id: Dragon['id'];
  type: FighterType.DRAGON;
};
export type Fighter = HeroFighter | DragonFighter;

export const isFighterAHero = (fighter: Fighter): fighter is HeroFighter =>
  fighter.type === FighterType.HERO;
export const isFighterADragon = (fighter: Fighter): fighter is DragonFighter =>
  fighter.type === FighterType.DRAGON;
