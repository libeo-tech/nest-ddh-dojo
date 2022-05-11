import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ok } from 'neverthrow';
import { GetAllPort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
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

  @WrapInTryCatchWithUnknownApplicationError('ItemModule')
  @LogPayloadAndResult('ItemModule')
  public async execute(): Promise<GetAllItemsQueryResult> {
    const items = await this.itemPorts.getAll();
    return ok({ items });
  }
}
