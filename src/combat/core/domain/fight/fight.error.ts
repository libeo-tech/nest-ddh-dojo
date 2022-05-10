import { DragonNotFoundError } from '../../../../dragons/core/domain/dragon.error';
import { HeroNotFoundError } from '../../../../heroes/core/domain/hero.error';

export type FighterNotFoundError = HeroNotFoundError | DragonNotFoundError;
