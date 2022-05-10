import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ItemWithOwner } from '../../../domain/item.entity';
import { ItemWithOwnerPorts } from '../../../domain/item-with-owner.ports';
import {
  GetHeroItemsQuery,
  GetHeroItemsQueryResult,
} from './get-hero-items.query';
import { ok } from 'neverthrow';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';

@QueryHandler(GetHeroItemsQuery)
export class GetHeroItemsQueryHandler
  implements IQueryHandler<GetHeroItemsQuery>
{
  constructor(
    @Inject(ItemWithOwner)
    private readonly itemWithOwnerPorts: Pick<
      ItemWithOwnerPorts,
      'getItemsByOwnerId'
    >,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('ItemModule')
  @LogPayloadAndResult('ItemModule')
  public async execute({
    payload,
  }: GetHeroItemsQuery): Promise<GetHeroItemsQueryResult> {
    const { ownerId } = payload;

    const items = await this.itemWithOwnerPorts.getItemsByOwnerId(ownerId);
    return ok({ items });
  }
}
