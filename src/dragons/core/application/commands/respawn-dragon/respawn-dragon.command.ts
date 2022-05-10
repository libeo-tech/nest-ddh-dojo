import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';

export class RespawnDragonCommand implements ICommand {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
    },
  ) {}
}

export type RespawnDragonCommandResult = Result<void, DragonNotFoundError>;
