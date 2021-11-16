import { heroEntityFactory } from '../../../../../heroes/core/domain/hero.entity-factory';
import { ItemMockAdapter } from '../../../../infrastructure/mock/item.mock-adapter';
import { GenerateRandomItemCommand } from './generate-random-item.command';
import { GenerateRandomItemCommandHandler } from './generate-random-item.command-handler';

describe('generate random item command', () => {
  const itemMockAdapter = new ItemMockAdapter();
  const generateRandomItemCommandHandler = new GenerateRandomItemCommandHandler(
    itemMockAdapter,
    itemMockAdapter,
  );

  it('should give a new random item to a hero', async () => {
    const hero = heroEntityFactory();
    const generateRandomItemCommand = new GenerateRandomItemCommand({
      ownerId: hero.id,
    });
    await generateRandomItemCommandHandler.execute(generateRandomItemCommand);

    const items = await itemMockAdapter.getItemsByOwnerId(hero.id);
    expect(items).toHaveLength(1);
    itemMockAdapter.delete(items[0].id);
  });
});
