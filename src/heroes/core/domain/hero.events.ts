import { IEvent } from '@nestjs/cqrs';
import { Damage } from '../../../combat/core/domain/attack/damage.object-value';
import { Fighter } from '../../../combat/core/domain/fight/fighter.entity';
import { Hero } from './hero.entity';

export class HeroGainedXpEvent implements IEvent {
  constructor(public readonly payload: { heroId: Hero['id'] }) {}
}
export class HeroGotHurtEvent implements IEvent {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      damage: Damage<Fighter>;
    },
  ) {}
}

export class HeroDiedEvent implements IEvent {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      source: Damage<Fighter>['source'];
    },
  ) {}
}
