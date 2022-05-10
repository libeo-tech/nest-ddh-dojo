import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { combine, err, ok } from 'neverthrow';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
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

  @WrapInTryCatchWithUnknownApplicationError('CombatModule')
  @LogPayloadAndResult('CombatModule')
  public async execute({
    payload,
  }: RewardHeroCommand): Promise<RewardHeroCommandResult> {
    const { heroId, dragonId } = payload;

    const dragonResult = await this.dragonPresenter.getById(dragonId);
    if (dragonResult.isErr()) {
      return err(dragonResult.error);
    }
    const { dragon } = dragonResult.value;

    const reward = getRewardFromDragon(dragon.level);
    const results = combine([
      await this.heroPresenter.gainXp(heroId, reward.xpGain),
      await this.itemPresenter.giveNewRandomItemToHero(heroId),
    ]);
    if (results.isErr()) {
      return err(results.error);
    }
    return ok(void 0);
  }
}
