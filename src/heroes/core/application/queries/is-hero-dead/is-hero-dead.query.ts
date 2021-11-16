import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Hero } from '../../../domain/hero.entity';

export class IsHeroDeadQuery implements IQuery {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
    },
  ) {}
}

export class IsHeroDeadQueryResult implements IQueryResult {
  constructor(public readonly isDead: boolean) {}
}
