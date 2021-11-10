import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { Dragon } from '../../../domain/dragon.entity';

export class HurtDragonCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      dragonId: Dragon['id'];
      damage: number;
    },
  ) {}
}
