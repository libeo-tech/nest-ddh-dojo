import { HeroMockAdapter } from '../../ports/hero.mock-adapter';
import { CreateHeroCommand } from './create-hero.command';
import { CreateHeroCommandHandler } from './create-hero.command-handler';

describe('create hero command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const createHeroCommandHandler = new CreateHeroCommandHandler(
    heroMockAdapter,
  );

  it('should create a level 1 hero', async () => {
    const command = new CreateHeroCommand({
      name: 'Batman',
    });
    await createHeroCommandHandler.execute(command);

    const heroes = await heroMockAdapter.getHeroes();
    expect(heroes).toHaveLength(1);
    expect(heroes[0].name).toBe('Batman');
    heroMockAdapter.deleteHero(heroes[0].id);
  });
});
