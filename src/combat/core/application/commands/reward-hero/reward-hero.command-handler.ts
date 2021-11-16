import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { DragonPresenter } from '../../../../../dragons/interface/presenter/dragon.presenter';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { HeroPresenter } from '../../../../../heroes/interface/presenter/hero.presenter';
import { Item } from '../../../../../items/core/domain/item.entity';
import { ItemPresenter } from '../../../../../items/interface/presenter/item.presenter';
import { getRewardFromDragon } from '../../../domain/reward/reward.service';
import { RewardHeroCommand } from './reward-hero.command';

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

  @withSpan()
  public async execute({ payload }: RewardHeroCommand): Promise<void> {
    this.logger.log(`> RewardHeroCommand: ${JSON.stringify(payload)}`);
    const { heroId, dragonId } = payload;

    const dragon = await this.dragonPresenter.getById(dragonId);
    const reward = getRewardFromDragon(dragon.level);
    await Promise.all([
      this.heroPresenter.gainXp(heroId, reward.xpGain),
      this.itemPresenter.giveNewRandomItemToHero(heroId),
    ]);
  }
}
