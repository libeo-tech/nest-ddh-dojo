import { ok, Result } from 'neverthrow';
import { Item } from '../../../../../items/core/domain/item.entity';
import { ItemMockAdapter } from '../../../../../items/infrastructure/mock/item.mock-adapter';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { Hero } from '../../../domain/hero.entity';
import { HeroDoesNotOwnItem } from '../../../domain/hero.error';
import { EquipItemCommand } from './equip-item.command';
import { EquipItemCommandHandler } from './equip-item.command-handler';

describe('equip item command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const itemMockAdapter = new ItemMockAdapter();
  const itemMockPresenter = {
    getHeroInventory: jest.fn<
      Promise<Result<{ items: Item[] }, never>>,
      [Hero['id']]
    >(),
  };
  const equipItemCommandHandler = new EquipItemCommandHandler(
    heroMockAdapter,
    itemMockPresenter,
  );

  beforeEach(() => {
    heroMockAdapter.reset();
    itemMockAdapter.reset();
  });

  it('hero should equip an item that he owns', async () => {
    const { id: heroId } = await heroMockAdapter.create({});
    const item = await itemMockAdapter.create({});

    itemMockPresenter.getHeroInventory.mockResolvedValueOnce(
      ok({ items: [item] }),
    );

    const result = await equipItemCommandHandler.execute(
      new EquipItemCommand({ heroId, itemId: item.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.equippedItem).toStrictEqual(item.id);
  });

  it('hero should not equip that he does not own', async () => {
    const { id: heroId } = await heroMockAdapter.create({});
    const item = await itemMockAdapter.create({});

    itemMockPresenter.getHeroInventory.mockResolvedValueOnce(ok({ items: [] }));

    const result = await equipItemCommandHandler.execute(
      new EquipItemCommand({ heroId, itemId: item.id }),
    );
    expect(result.isErr()).toBeTruthy();

    expect(result._unsafeUnwrapErr()).toStrictEqual(
      new HeroDoesNotOwnItem(heroId, item.id),
    );
  });
});
