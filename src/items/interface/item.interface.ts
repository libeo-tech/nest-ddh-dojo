import { InventoryResolver } from './graphql/inventory.resolver';
import { ItemResolver } from './graphql/item.resolver';
import { ItemPresenter } from './presenter/item.presenter';

export const ItemInterface = {
  resolvers: [InventoryResolver, ItemResolver],
  controllers: [],
  presenter: ItemPresenter,
};
