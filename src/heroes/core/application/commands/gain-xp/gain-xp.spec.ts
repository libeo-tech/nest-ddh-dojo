import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { GainXpCommand } from './gain-xp.command';
import { GainXpCommandHandler } from './gain-xp.command-handler';

describe('gain xp command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const gainXpHandler = new GainXpCommandHandler(heroMockAdapter, eventBusMock);

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should increase the xp of a hero by xpGain', async () => {
    const xpGain = generateRandomNumber(1, 100);
    const { id: heroId, xp } = await heroMockAdapter.create({});
    await gainXpHandler.execute(new GainXpCommand({ heroId, xpGain }));

    const { xp: newXp } = await heroMockAdapter.getById(heroId);
    expect(newXp).toEqual(xp + xpGain);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    await expect(
      gainXpHandler.execute(
        new GainXpCommand({ heroId: missingHeroId, xpGain: 1 }),
      ),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
