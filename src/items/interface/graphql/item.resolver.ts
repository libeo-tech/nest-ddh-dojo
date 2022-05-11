import { HttpException, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Query, Resolver } from '@nestjs/graphql';
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
  public async getAllItems(): Promise<ItemSchema[]> {
    const result = await this.queryBus.execute<
      GetAllItemsQuery,
      GetAllItemsQueryResult
    >(new GetAllItemsQuery());

    if (result.isErr()) {
      throw new HttpException(
        {
          message: 'UnknownError occurred on getAllItems Query',
        },
        500,
      );
    }

    const { items } = result.value;
    return items.map((item) => mapItemEntityToItemSchema(item));
  }
}
