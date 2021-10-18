import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Item } from '../../../domain/item.entity';

export class GetAllItemsQuery implements IQuery {}

export class GetAllItemsQueryResult implements IQueryResult {
  constructor(public readonly items: Item[]) {}
}
