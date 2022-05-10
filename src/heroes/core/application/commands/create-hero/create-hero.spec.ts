import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { CreateHeroCommand } from './create-hero.command';
import { CreateHeroCommandHandler } from './create-hero.command-handler';

describe('create hero command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const createHeroCommandHandler = new CreateHeroCommandHandler(
    heroMockAdapter,
  );

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should create a level 1 hero', async () => {
    const command = new CreateHeroCommand({
      name: 'Batman',
    });
    const result = await createHeroCommandHandler.execute(command);
    expect(result.isOk()).toBeTruthy();

    const heroes = await heroMockAdapter.getAll();
    expect(heroes).toHaveLength(1);
    expect(heroes[0].name).toBe('Batman');
  });
});
