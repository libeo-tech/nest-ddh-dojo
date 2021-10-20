import { Hero } from './hero.entity';

export class HeroGainedXpEvent {
  constructor(public readonly payload: { heroId: Hero['id'] }) {}
}
