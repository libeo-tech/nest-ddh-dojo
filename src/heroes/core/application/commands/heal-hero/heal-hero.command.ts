import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../domain/hero.entity';

export class HealHeroCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      heal: number;
    },
  ) {}
}
