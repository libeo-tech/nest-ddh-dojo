import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Hero } from '../../../domain/hero.entity';

export class GetHeroAttackQuery implements IQuery {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
    },
  ) {}
}

export class GetHeroAttackQueryResult implements IQueryResult {
  constructor(public readonly attackValue: number) {}
}
