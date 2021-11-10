import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { AttackCommand } from './attack.command';
import { AttackCommandHandler } from './attack.command-handler';
import { dragonEntityFactory } from '../../../../../dragons/core/domain/dragon.entity-factory';

describe('attack command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const { id: targetId } = dragonEntityFactory();
  const attackHandler = new AttackCommandHandler(heroMockAdapter, eventBusMock);

  it('should generate an attack based for hero', async () => {
    const { id: heroId } = await heroMockAdapter.create({});
    await attackHandler.execute(new AttackCommand({ heroId, targetId }));

    expect(eventBusMock.publish).toHaveBeenCalled();
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    await expect(
      attackHandler.execute(
        new AttackCommand({ heroId: missingHeroId, targetId }),
      ),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
