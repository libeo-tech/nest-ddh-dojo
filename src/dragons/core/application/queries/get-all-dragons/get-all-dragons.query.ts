import { IQuery } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { Dragon } from '../../../domain/dragon.entity';

export class GetAllDragonsQuery implements IQuery {}

export type GetAllDragonsQueryResult = Result<{ dragons: Dragon[] }, never>;
