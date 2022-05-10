import { ok, Result } from 'neverthrow';
import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { dragonEntityFactory } from '../../../../../dragons/core/domain/dragon.entity-factory';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { heroEntityFactory } from '../../../../../heroes/core/domain/hero.entity-factory';
import { Item } from '../../../../../items/core/domain/item.entity';
import { getRewardFromDragon } from '../../../domain/reward/reward.service';
import { RewardHeroCommand } from './reward-hero.command';
import { RewardHeroCommandHandler } from './reward-hero.command-handler';

describe('reward hero command', () => {
  const dragonPresenter = {
    getById: jest.fn<
      Promise<Result<{ dragon: Dragon }, never>>,
      [Dragon['id']]
    >(),
  };
  const heroPresenter = {
    gainXp: jest.fn<Promise<Result<void, never>>, [Hero['id'], number]>(),
  };
  const itemPresenter = {
    giveNewRandomItemToHero: jest.fn<
      Promise<Result<{ item: Item }, never>>,
      [Hero['id']]
    >(),
  };
  const rewardHeroHandler = new RewardHeroCommandHandler(
    dragonPresenter,
    heroPresenter,
    itemPresenter,
  );

  it('should reward hero based on level of dragon killed', async () => {
    const { id: heroId } = heroEntityFactory({});
    const dragon = dragonEntityFactory();
    dragonPresenter.getById.mockResolvedValueOnce(ok({ dragon }));
    heroPresenter.gainXp.mockResolvedValueOnce(ok(void 0));
    const result = await rewardHeroHandler.execute(
      new RewardHeroCommand({ heroId, dragonId: dragon.id }),
    );
    expect(result.isOk()).toBeTruthy();

    expect(heroPresenter.gainXp).toHaveBeenCalledWith(
      heroId,
      getRewardFromDragon(dragon.level).xpGain,
    );
    expect(itemPresenter.giveNewRandomItemToHero).toHaveBeenCalledWith(heroId);
  });
});
