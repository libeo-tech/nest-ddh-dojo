import { ICommand } from '@nestjs/cqrs';
import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';

export class RewardHeroCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      dragonId: Dragon['id'];
    },
  ) {}
}
