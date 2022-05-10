import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { DragonPresenter } from '../../../../../dragons/interface/presenter/dragon.presenter';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { HeroPresenter } from '../../../../../heroes/interface/presenter/hero.presenter';
import { Item } from '../../../../../items/core/domain/item.entity';
import { ItemPresenter } from '../../../../../items/interface/presenter/item.presenter';
import { getRewardFromDragon } from '../../../domain/reward/reward.service';
import {
  RewardHeroCommand,
  RewardHeroCommandResult,
} from './reward-hero.command';

@CommandHandler(RewardHeroCommand)
export class RewardHeroCommandHandler
  implements ICommandHandler<RewardHeroCommand>
{
  constructor(
    @Inject(Dragon)
    private readonly dragonPresenter: Pick<DragonPresenter, 'getById'>,
    @Inject(Hero) private readonly heroPresenter: Pick<HeroPresenter, 'gainXp'>,
    @Inject(Item)
    private readonly itemPresenter: Pick<
      ItemPresenter,
      'giveNewRandomItemToHero'
    >,
  ) {}

  private readonly logger = new Logger(RewardHeroCommandHandler.name);

  public async execute({
    payload,
  }: RewardHeroCommand): Promise<RewardHeroCommandResult> {
    this.logger.log(`> RewardHeroCommand: ${JSON.stringify(payload)}`);
    const { heroId, dragonId } = payload;

    const dragonResult = await this.dragonPresenter.getById(dragonId);
    if (dragonResult.isErr()) {
      return err(dragonResult.error);
    }
    const { dragon } = dragonResult.value;

    const reward = getRewardFromDragon(dragon.level);
    const gainXpResult = await this.heroPresenter.gainXp(heroId, reward.xpGain);
    if (gainXpResult.isErr()) {
      return err(gainXpResult.error);
    }

    await this.itemPresenter.giveNewRandomItemToHero(heroId);
    return ok(void 0);
  }
}
