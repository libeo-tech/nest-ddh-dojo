import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { ItemPorts } from '../../ports/item.ports';
import {
  GetAllItemsQuery,
  GetAllItemsQueryResult,
} from './get-all-items.query';

@QueryHandler(GetAllItemsQuery)
export class GetAllItemsQueryHandler
  implements IQueryHandler<GetAllItemsQuery>
{
  constructor(private readonly itemPorts: ItemPorts) {}

  private readonly logger = new Logger(GetAllItemsQueryHandler.name);

  @withSpan()
  public async execute(): Promise<GetAllItemsQueryResult> {
    this.logger.log(`> GetAllItemsQuery`);

    const items = await this.itemPorts.getAllItems();
    return new GetAllItemsQueryResult(items);
  }
}
