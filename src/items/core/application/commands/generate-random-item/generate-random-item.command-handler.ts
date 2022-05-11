import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePort } from '../../../../../common/core/domain/base.ports';
import { Item, ItemWithOwner } from '../../../domain/item.entity';
import { itemEntityFactory } from '../../../domain/item.entity-factory';
import { ItemWithOwnerPorts } from '../../../domain/item-with-owner.ports';
import {
  GenerateRandomItemCommand,
  GenerateRandomItemCommandResult,
} from './generate-random-item.command';
import { ok } from 'neverthrow';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';

@CommandHandler(GenerateRandomItemCommand)
export class GenerateRandomItemCommandHandler
  implements ICommandHandler<GenerateRandomItemCommand>
{
  constructor(
    @Inject(Item) private readonly itemPorts: CreatePort<Item>,
    @Inject(ItemWithOwner)
    private readonly itemWithOwnerPorts: Pick<
      ItemWithOwnerPorts,
      'attributeOwnerOfItem'
    >,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('ItemModule')
  @LogPayloadAndResult('ItemModule')
  public async execute({
    payload,
  }: GenerateRandomItemCommand): Promise<GenerateRandomItemCommandResult> {
    const { ownerId } = payload;

    const randomItem = itemEntityFactory();
    const item = await this.itemPorts.create(randomItem);
    await this.itemWithOwnerPorts.attributeOwnerOfItem(item.id, ownerId);
    return ok({ item });
  }
}
