import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../../../heroes/infrastructure/heroes/hero.orm-entity';
import { Dragon } from '../../../../infrastructure/dragons/dragon.orm-entity';

export class SlayDragonCommand implements ICommand {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
      heroId: Hero['id'];
    },
  ) {}
}
