import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Query, Resolver } from '@nestjs/graphql';
import { withSpan } from '../../../common/utils/trace/honeycomb';
import { Item as ItemSchema } from '../../../graphql';
import {
  GetAllItemsQuery,
  GetAllItemsQueryResult,
} from '../../core/application/queries/get-all-items/get-all-items.query';
import { mapItemEntityToItemSchema } from './item.gql-mapper';

@Resolver('item')
export class ItemResolver {
  private readonly logger = new Logger(ItemResolver.name);

  constructor(private readonly queryBus: QueryBus) {}

  @Query()
  @withSpan()
  public async getAllItems(): Promise<ItemSchema[]> {
    const { items } = await this.queryBus.execute<
      GetAllItemsQuery,
      GetAllItemsQueryResult
    >(new GetAllItemsQuery());
    return items.map((item) => mapItemEntityToItemSchema(item));
  }
}
