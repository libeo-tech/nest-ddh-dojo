import { IEvent } from '@nestjs/cqrs';
import { Hero } from '../../../heroes/infrastructure/heroes/hero.orm-entity';
import { Dragon } from '../../infrastructure/dragons/dragon.orm-entity';

export class DragonSlainEvent implements IEvent {
  constructor(
    public readonly heroId: Hero['id'],
    public readonly dragonId: Dragon['id'],
  ) {}
}
