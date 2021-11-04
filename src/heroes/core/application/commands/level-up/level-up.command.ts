import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../../infrastructure/typeorm/hero.orm-entity';

export class LevelUpCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
    },
  ) {}
}
