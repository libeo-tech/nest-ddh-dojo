import { IQuery } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { Item } from '../../../domain/item.entity';

export class GetAllItemsQuery implements IQuery {}

export type GetAllItemsQueryResult = Result<{ items: Item[] }, never>;
