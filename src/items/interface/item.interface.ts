import { ItemResolver } from './graphql/item.resolver';
import { ItemPresenter } from './presenter/item.presenter';

export const ItemInterface = {
  resolvers: [ItemResolver],
  controllers: [],
  presenter: ItemPresenter,
};
