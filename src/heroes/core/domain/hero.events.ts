import { IEvent } from '@nestjs/cqrs';
import { Hero } from './hero.entity';

export class HeroGainedXpEvent implements IEvent {
  constructor(public readonly payload: { heroId: Hero['id'] }) {}
}
