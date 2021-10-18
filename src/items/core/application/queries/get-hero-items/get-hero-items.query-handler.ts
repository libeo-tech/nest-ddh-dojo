import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ItemPorts } from '../../ports/item.ports';
import {
  GetHeroItemsQuery,
  GetHeroItemsQueryResult,
} from './get-hero-items.query';

@QueryHandler(GetHeroItemsQuery)
export class GetHeroItemsQueryHandler
  implements IQueryHandler<GetHeroItemsQuery>
{
  constructor(private readonly itemPorts: ItemPorts) {}

  private readonly logger = new Logger(GetHeroItemsQueryHandler.name);

  public async execute({
    payload,
  }: GetHeroItemsQuery): Promise<GetHeroItemsQueryResult> {
    this.logger.log(`> GetHeroItemsQuery: ${JSON.stringify(payload)}`);
    const { ownerId } = payload;

    const items = await this.itemPorts.getItemsByOwnerId(ownerId);
    return new GetHeroItemsQueryResult(items);
  }
}
