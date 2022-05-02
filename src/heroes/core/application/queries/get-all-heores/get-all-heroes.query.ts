import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Hero } from '../../../domain/hero.entity';

export class GetAllHeroesQuery implements IQuery {}

export class GetAllHeroesQueryResult implements IQueryResult {
  constructor(public readonly heroes: Hero[]) {}
}
