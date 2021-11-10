import { Dragon } from '../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../hero.entity';

export class HeroAttackedTargetEvent {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      targetId: Dragon['id'];
      attackValue: number;
    },
  ) {}
}
