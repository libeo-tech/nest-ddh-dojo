import { IEvent } from '@nestjs/cqrs';
import { Hero } from '../../../heroes/infrastructure/heroes/hero.orm-entity';
import { Dragon } from '../../infrastructure/dragons/dragon.orm-entity';

export class DragonSlainEvent implements IEvent {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      dragon: {
        id: Dragon['id'];
        level: Dragon['level'];
      };
    },
  ) {}
}
