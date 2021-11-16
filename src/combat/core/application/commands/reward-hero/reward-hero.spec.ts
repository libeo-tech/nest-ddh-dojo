import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { dragonEntityFactory } from '../../../../../dragons/core/domain/dragon.entity-factory';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { heroEntityFactory } from '../../../../../heroes/core/domain/hero.entity-factory';
import { getRewardFromDragon } from '../../../domain/reward/reward.service';
import { RewardHeroCommand } from './reward-hero.command';
import { RewardHeroCommandHandler } from './reward-hero.command-handler';

describe('reward hero command', () => {
  const dragonPresenter = {
    getById: jest.fn<Promise<Dragon>, [Dragon['id']]>(),
  };
  const heroPresenter = {
    gainXp: jest.fn<Promise<void>, [Hero['id'], number]>(),
  };
  const itemPresenter = {
    giveNewRandomItemToHero: jest.fn<Promise<void>, [Hero['id']]>(),
  };
  const attackHandler = new RewardHeroCommandHandler(
    dragonPresenter,
    heroPresenter,
    itemPresenter,
  );

  it('should reward hero based on level of dragon killed', async () => {
    const { id: heroId } = heroEntityFactory({});
    const dragon = dragonEntityFactory();
    dragonPresenter.getById.mockResolvedValueOnce(dragon);
    await attackHandler.execute(
      new RewardHeroCommand({ heroId, dragonId: dragon.id }),
    );

    expect(heroPresenter.gainXp).toHaveBeenCalledWith(
      heroId,
      getRewardFromDragon(dragon.level).xpGain,
    );
    expect(itemPresenter.giveNewRandomItemToHero).toHaveBeenCalledWith(heroId);
  });
});
