import { IEvent } from '@nestjs/cqrs';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { Dragon } from './dragon.entity';
import { Reward } from './reward/reward';

export class DragonGotHurtEvent implements IEvent {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
      damage: number;
    },
  ) {}
}

export class DragonSlainEvent implements IEvent {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      dragonId: Dragon['id'];
      reward: Reward;
    },
  ) {}
}
