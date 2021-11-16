import { IEvent } from '@nestjs/cqrs';
import { Damage } from '../../../combat/core/domain/attack/damage.object-value';
import { HeroFighter } from '../../../combat/core/domain/fight/fighter.entity';
import { Dragon } from './dragon.entity';

export class DragonGotHurtEvent implements IEvent {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
      damage: Damage<HeroFighter>;
    },
  ) {}
}

export class DragonSlainEvent implements IEvent {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
      source: Damage<HeroFighter>['source'];
    },
  ) {}
}
