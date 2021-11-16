import { DragonResolver } from './graphql/dragon.resolver';
import { DragonFighterPresenter } from './presenter/dragon-fighter.presenter';
import { DragonPresenter } from './presenter/dragon.presenter';

export const DragonInterface = {
  resolvers: [DragonResolver],
  controllers: [],
  presenters: [DragonPresenter, DragonFighterPresenter],
};
