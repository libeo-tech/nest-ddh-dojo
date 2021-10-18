import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Hero } from '../../../domain/hero.entity';

export class GetHeroByIdQuery implements IQuery {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
    },
  ) {}
}

export class GetHeroByIdQueryResult implements IQueryResult {
  constructor(public readonly hero: Hero) {}
}
