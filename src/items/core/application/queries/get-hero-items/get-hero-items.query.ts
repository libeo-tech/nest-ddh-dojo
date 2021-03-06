import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { IQuery } from '@nestjs/cqrs';
import { Item } from '../../../domain/item.entity';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';

export class GetHeroItemsQuery implements IQuery {
  constructor(
    public readonly payload: {
      ownerId: Hero['id'];
    },
  ) {}
}

export type GetHeroItemsQueryResult = Result<
  { items: Item[] },
  UnknownApplicationError
>;
