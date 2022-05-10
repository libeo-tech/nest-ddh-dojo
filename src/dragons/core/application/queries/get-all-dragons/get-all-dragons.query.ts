import { IQuery } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Dragon } from '../../../domain/dragon.entity';

export class GetAllDragonsQuery implements IQuery {}

export type GetAllDragonsQueryResult = Result<
  { dragons: Dragon[] },
  UnknownApplicationError
>;
