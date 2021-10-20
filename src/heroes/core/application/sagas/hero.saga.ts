import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { filter, from, map, mergeMap, Observable } from 'rxjs';
import { DragonSlainEvent } from '../../../../dragons/core/domain/dragon.events';
import { HeroGainedXpEvent } from '../../domain/hero.events';
import { doesHeroLevelUp } from '../../domain/xp/xp.service';
import { GainXpCommand } from '../commands/gain-xp/gain-xp.command';
import { LevelUpCommand } from '../commands/level-up/level-up.command';
import { HeroPorts } from '../ports/hero.ports';

@Injectable()
export class HeroSagas {
  constructor(private readonly heroPorts: HeroPorts) {}

  @Saga()
  dragonSlain = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DragonSlainEvent),
      map(
        ({ payload: { heroId } }) => new GainXpCommand({ heroId, xpDelta: 10 }),
      ),
    );
  };

  @Saga()
  xpGain = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(HeroGainedXpEvent),
      mergeMap(({ payload: { heroId } }) =>
        from(this.heroPorts.getHeroById(heroId)).pipe(
          filter(doesHeroLevelUp),
          map(() => new LevelUpCommand({ heroId })),
        ),
      ),
    );
  };
}
