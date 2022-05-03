import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPort } from '../../../../../common/core/domain/base.ports';
import { Item } from '../../../domain/item.entity';
import {
  GetAllItemsQuery,
  GetAllItemsQueryResult,
} from './get-all-items.query';

@QueryHandler(GetAllItemsQuery)
export class GetAllItemsQueryHandler
  implements IQueryHandler<GetAllItemsQuery>
{
  constructor(@Inject(Item) private readonly itemPorts: GetAllPort<Item>) {}

  private readonly logger = new Logger(GetAllItemsQueryHandler.name);

  public async execute(): Promise<GetAllItemsQueryResult> {
    this.logger.log(`> GetAllItemsQuery`);

    const items = await this.itemPorts.getAll();
    return new GetAllItemsQueryResult(items);
  }
}
