import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { ItemWithOwner } from '../../../domain/item.entity';
import { ItemWithOwnerPorts } from '../../ports/item-with-owner.ports';
import {
  GetHeroItemsQuery,
  GetHeroItemsQueryResult,
} from './get-hero-items.query';

@QueryHandler(GetHeroItemsQuery)
export class GetHeroItemsQueryHandler
  implements IQueryHandler<GetHeroItemsQuery>
{
  constructor(
    @Inject(ItemWithOwner.name)
    private readonly itemWithOwnerPorts: Pick<
      ItemWithOwnerPorts,
      'getItemsByOwnerId'
    >,
  ) {}

  private readonly logger = new Logger(GetHeroItemsQueryHandler.name);

  @withSpan()
  public async execute({
    payload,
  }: GetHeroItemsQuery): Promise<GetHeroItemsQueryResult> {
    this.logger.log(`> GetHeroItemsQuery: ${JSON.stringify(payload)}`);
    const { ownerId } = payload;

    const items = await this.itemWithOwnerPorts.getItemsByOwnerId(ownerId);
    return new GetHeroItemsQueryResult(items);
  }
}
