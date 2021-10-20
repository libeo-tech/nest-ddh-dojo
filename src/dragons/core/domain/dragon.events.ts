import { IEvent } from '@nestjs/cqrs';
import { Hero } from '../../../heroes/infrastructure/heroes/hero.orm-entity';
import { Dragon } from '../../infrastructure/dragons/dragon.orm-entity';
import { Reward } from './reward/reward';

export class DragonSlainEvent implements IEvent {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      dragonId: Dragon['id'];
      reward: Reward;
    },
  ) {}
}
