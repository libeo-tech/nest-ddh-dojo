import { Hero } from './hero.entity';

export class HeroGainedXpEvent {
  constructor(public readonly heroId: Hero['id']) {}
}
