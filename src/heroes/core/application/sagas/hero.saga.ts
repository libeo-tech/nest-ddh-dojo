import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { DragonSlainEvent } from '../../../../dragons/core/domain/dragon.events';
import { LevelUpCommand } from '../commands/level-up/level-up.command';

@Injectable()
export class HeroSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DragonSlainEvent),
      map(({ heroId }) => new LevelUpCommand({ heroId })),
    );
  };
}
