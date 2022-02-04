import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { delay, map, Observable } from 'rxjs';
import { DragonSlainEvent } from '../../domain/dragon.events';
import { RespawnDragonCommand } from '../commands/respawn-dragon/respawn-dragon.command';

@Injectable()
export class DragonSagas {
  @Saga()
  respawnDragon = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DragonSlainEvent),
      delay(1000 * 60),
      map(
        ({ payload: { dragonId } }) => new RespawnDragonCommand({ dragonId }),
      ),
    );
  };
}
