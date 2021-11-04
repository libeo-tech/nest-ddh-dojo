import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { Dragon } from '../../../domain/dragon.entity';

export class SlayDragonCommand implements ICommand {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
      heroId: Hero['id'];
    },
  ) {}
}
