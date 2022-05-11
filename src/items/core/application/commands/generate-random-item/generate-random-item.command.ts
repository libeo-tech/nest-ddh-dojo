import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { Item } from '../../../domain/item.entity';

export class GenerateRandomItemCommand implements ICommand {
  constructor(
    public readonly payload: {
      ownerId?: Hero['id'];
    },
  ) {}
}

export type GenerateRandomItemCommandResult = Result<
  { item: Item },
  UnknownApplicationError
>;
