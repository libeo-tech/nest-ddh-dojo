import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../../infrastructure/typeorm/hero.orm-entity';

export class GainXpCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      xpDelta: Hero['xp'];
    },
  ) {}
}
