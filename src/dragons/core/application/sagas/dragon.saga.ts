import { Inject, Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { filter, from, map, mergeMap, Observable } from 'rxjs';
import { GetByIdPort } from '../../../../common/core/ports/base.ports';
import { HeroAttackedTargetEvent } from '../../../../heroes/core/domain/attack/attack.event';
import { Dragon } from '../../domain/dragon.entity';
import { DragonGotHurtEvent } from '../../domain/dragon.events';
import { HurtDragonCommand } from '../commands/hurt-dragon/hurt-dragon.command';
import { SlayDragonCommand } from '../commands/slay-dragon/slay-dragon.command';

const isDragonDead = (dragon: Dragon): boolean => dragon.currentHp <= 0;

@Injectable()
export class DragonSagas {
  constructor(
    @Inject(Dragon)
    private readonly dragonPorts: GetByIdPort<Dragon>,
  ) {}

  @Saga()
  dragonIsAttacked = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(HeroAttackedTargetEvent),
      map(
        ({ payload: { heroId, targetId: dragonId, attackValue: damage } }) =>
          new HurtDragonCommand({ heroId, dragonId, damage }),
      ),
    );
  };

  @Saga()
  dragonIsSlain = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DragonGotHurtEvent),
      mergeMap(({ payload: { dragonId, heroId } }) =>
        from(this.dragonPorts.getById(dragonId)).pipe(
          filter(isDragonDead),
          map(() => new SlayDragonCommand({ heroId, dragonId })),
        ),
      ),
    );
  };
}
