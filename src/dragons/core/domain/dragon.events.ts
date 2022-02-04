import { IEvent } from '@nestjs/cqrs';
import { Dragon } from './dragon.entity';

export class DragonSlainEvent implements IEvent {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
    },
  ) {}
}
