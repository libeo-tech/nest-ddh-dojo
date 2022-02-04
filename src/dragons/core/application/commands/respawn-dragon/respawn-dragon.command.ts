import { ICommand } from '@nestjs/cqrs';
import { Dragon } from '../../../domain/dragon.entity';

export class RespawnDragonCommand implements ICommand {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
    },
  ) {}
}
