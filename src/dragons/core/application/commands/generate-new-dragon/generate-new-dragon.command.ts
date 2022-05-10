import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { Dragon } from '../../../domain/dragon.entity';

export class GenerateNewDragonCommand implements ICommand {
  constructor(
    public readonly payload: {
      level?: Dragon['level'];
      color?: Dragon['color'];
    },
  ) {}
}

export type GenerateNewDragonCommandResult = Result<Dragon, never>;
