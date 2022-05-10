import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';

export class HealHeroCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      heal: number;
    },
  ) {}
}
export type HealHeroCommandResult = Result<void, HeroNotFoundError>;
