import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Item } from '../../../domain/item.entity';

export class GetHeroItemsQuery implements IQuery {
  constructor(
    public readonly payload: {
      ownerId: Hero['id'];
    },
  ) {}
}

export class GetHeroItemsQueryResult implements IQueryResult {
  constructor(public readonly items: Item[]) {}
}
