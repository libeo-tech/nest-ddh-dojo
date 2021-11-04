import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../../infrastructure/typeorm/hero.orm-entity';

export class CreateHeroCommand implements ICommand {
  constructor(
    public readonly payload: {
      name: Hero['name'];
    },
  ) {}
}
