import { Inject, Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { filter, from, map, mergeMap, Observable } from 'rxjs';
import { GetByIdPort } from '../../../../common/core/ports/base.ports';
import { DragonSlainEvent } from '../../../../dragons/core/domain/dragon.events';
import { Hero } from '../../domain/hero.entity';
import { HeroGainedXpEvent } from '../../domain/hero.events';
import { doesHeroLevelUp } from '../../domain/xp/xp.service';
import { GainXpCommand } from '../commands/gain-xp/gain-xp.command';
import { LevelUpCommand } from '../commands/level-up/level-up.command';

@Injectable()
export class HeroSagas {
  constructor(@Inject(Hero) private readonly heroPorts: GetByIdPort<Hero>) {}

  @Saga()
  dragonSlain = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DragonSlainEvent),
      map(
        ({
          payload: {
            heroId,
            reward: { xpGain },
          },
        }) =>
          new GainXpCommand({
            heroId,
            xpDelta: xpGain,
          }),
      ),
    );
  };

  @Saga()
  xpGain = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(HeroGainedXpEvent),
      mergeMap(({ payload: { heroId } }) =>
        from(this.heroPorts.getById(heroId)).pipe(
          filter(doesHeroLevelUp),
          map(() => new LevelUpCommand({ heroId })),
        ),
      ),
    );
  };
}
