import { InternalServerErrorException, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Query, Resolver } from '@nestjs/graphql';
import { Item as ItemSchema } from '../../../graphql';
import {
  GetAllItemsQuery,
  GetAllItemsQueryResult,
} from '../../core/application/queries/get-all-items/get-all-items.query';
import { mapItemEntityToItemSchema } from './item.gql-mapper';

@Resolver('Item')
export class ItemResolver {
  private readonly logger = new Logger(ItemResolver.name);

  constructor(private readonly queryBus: QueryBus) {}

  @Query()
  public async getAllItems(): Promise<ItemSchema[]> {
    const result = await this.queryBus.execute<
      GetAllItemsQuery,
      GetAllItemsQueryResult
    >(new GetAllItemsQuery());

    if (result.isErr()) {
      throw new InternalServerErrorException();
    }

    const { items } = result.value;
    return items.map((item) => mapItemEntityToItemSchema(item));
  }
}
