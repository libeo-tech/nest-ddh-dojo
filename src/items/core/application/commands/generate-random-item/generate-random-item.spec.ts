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

  beforeEach(() => {
    itemMockAdapter.reset();
  });

  it('should give a new random item to a hero', async () => {
    const hero = heroEntityFactory();
    const generateRandomItemCommand = new GenerateRandomItemCommand({
      ownerId: hero.id,
    });
    const result = await generateRandomItemCommandHandler.execute(
      generateRandomItemCommand,
    );
    expect(result.isOk()).toBeTruthy();

    const items = await itemMockAdapter.getItemsByOwnerId(hero.id);
    expect(items).toHaveLength(1);

    const { item } = result._unsafeUnwrap();
    expect(item).toMatchObject(items[0]);
  });
});
