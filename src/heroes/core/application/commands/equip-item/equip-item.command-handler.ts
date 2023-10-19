import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { Item } from '../../../../../items/core/domain/item.entity';
import { ItemPresenter } from '../../../../../items/interface/presenter/item.presenter';
import { Hero } from '../../../domain/hero.entity';
import {
  HeroDoesNotOwnItem,
  HeroNotFoundError,
} from '../../../domain/hero.error';
import { EquipItemCommand, EquipItemCommandResult } from './equip-item.command';

@CommandHandler(EquipItemCommand)
export class EquipItemCommandHandler
  implements ICommandHandler<EquipItemCommand>
{
  constructor(
    @Inject(Hero)
    private readonly heroPorts: UpdatePort<Hero> & GetByIdPort<Hero>,
    @Inject(Item)
    private readonly itemPresenter: Pick<ItemPresenter, 'getHeroInventory'>,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute({
    payload,
  }: EquipItemCommand): Promise<EquipItemCommandResult> {
    const { heroId, itemId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      return err(new HeroNotFoundError(heroId));
    }
    const inventoryResult = await this.itemPresenter.getHeroInventory(heroId);
    if (inventoryResult.isErr()) {
      return err(inventoryResult.error);
    }
    const itemIds = inventoryResult.value.items.map((item) => item.id);

    if (!itemIds.includes(itemId)) {
      return err(new HeroDoesNotOwnItem(heroId, itemId));
    }

    await this.heroPorts.update(heroId, { equippedItem: itemId });

    return ok(void 0);
  }
}
