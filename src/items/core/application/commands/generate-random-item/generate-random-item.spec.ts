import { heroFixtureFactory } from '../../../../../heroes/core/domain/hero.fixture-factory';
import { ItemMockAdapter } from '../../../../infrastructure/mock/item.mock-adapter';
import { GenerateRandomItemCommand } from './generate-random-item.command';
import { GenerateRandomItemCommandHandler } from './generate-random-item.command-handler';

describe('generate random item command', () => {
  const itemMockAdapter = new ItemMockAdapter();
  const generateRandomItemCommandHandler = new GenerateRandomItemCommandHandler(
    itemMockAdapter,
  );

  it('should generate a new random item', async () => {
    const hero = heroFixtureFactory();
    const generateRandomItemCommand = new GenerateRandomItemCommand({
      ownerId: hero.id,
    });
    await generateRandomItemCommandHandler.execute(generateRandomItemCommand);

    const items = await itemMockAdapter.getItemsByOwnerId(hero.id);
    expect(items).toHaveLength(1);
    itemMockAdapter.delete(items[0].id);
  });
});
