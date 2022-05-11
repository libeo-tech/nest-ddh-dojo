import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Item } from '../../../../../items/core/domain/item.entity';
import { Hero } from '../../../domain/hero.entity';
import {
  HeroDoesNotOwnItem,
  HeroNotFoundError,
} from '../../../domain/hero.error';

export class EquipItemCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      itemId: Item['id'];
    },
  ) {}
}

export type EquipItemCommandResult = Result<
  void,
  HeroNotFoundError | HeroDoesNotOwnItem | UnknownApplicationError
>;
