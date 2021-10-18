import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { DragonSlainEvent } from '../../../../dragons/core/domain/dragon.events';
import { GenerateRandomItemCommand } from '../commands/generate-random-item/generate-random-item.command';

@Injectable()
export class ItemSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DragonSlainEvent),
      map(({ heroId }) => new GenerateRandomItemCommand({ ownerId: heroId })),
    );
  };
}
