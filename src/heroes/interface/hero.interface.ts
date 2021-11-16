import { HeroResolver } from './graphql/hero.resolver';
import { HeroFighterPresenter } from './presenter/hero-fighter.presenter';
import { HeroPresenter } from './presenter/hero.presenter';

export const HeroInterface = {
  resolvers: [HeroResolver],
  controllers: [],
  presenters: [HeroFighterPresenter, HeroPresenter],
};
