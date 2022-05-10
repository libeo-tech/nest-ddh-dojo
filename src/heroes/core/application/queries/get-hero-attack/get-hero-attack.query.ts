import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';

export class GetHeroAttackQuery implements IQuery {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
    },
  ) {}
}

export type GetHeroAttackQueryResult = Result<
  { attackValue: number },
  HeroNotFoundError
>;
