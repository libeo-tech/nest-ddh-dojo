import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../ports/hero.mock-adapter';
import { GainXpCommand } from './gain-xp.command';
import { GainXpCommandHandler } from './gain-xp.command-handler';

describe('gain xp command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const gainXpHandler = new GainXpCommandHandler(heroMockAdapter, eventBusMock);

  it('should increase the xp of a hero by xpDelta', async () => {
    const xpDelta = generateRandomNumber(1, 100);
    const { id: heroId, xp } = await heroMockAdapter.addHero({});
    await gainXpHandler.execute(new GainXpCommand({ heroId, xpDelta }));

    const { xp: newXp } = await heroMockAdapter.getHeroById(heroId);
    expect(newXp).toEqual(xp + xpDelta);
    await heroMockAdapter.deleteHero(heroId);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    await expect(
      gainXpHandler.execute(
        new GainXpCommand({ heroId: missingHeroId, xpDelta: 1 }),
      ),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
