import { Inject, Injectable } from '@nestjs/common';
import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import {
  filter,
  from,
  interval,
  map,
  mergeAll,
  mergeMap,
  Observable,
} from 'rxjs';
import {
  GetAllPort,
  GetByIdPort,
} from '../../../../common/core/domain/base.ports';
import { getHeroMaxHp, Hero } from '../../domain/hero.entity';
import { HeroGainedXpEvent } from '../../domain/hero.events';
import { doesHeroLevelUp } from '../../domain/xp/xp.service';
import { HealHeroCommand } from '../commands/heal-hero/heal-hero.command';
import { LevelUpCommand } from '../commands/level-up/level-up.command';

const isHeroAlive = (hero: Hero): boolean => hero.currentHp > 0;
const doesHeroNeedHealing = (hero: Hero): boolean =>
  isHeroAlive(hero) && hero.currentHp < getHeroMaxHp(hero.level);

@Injectable()
export class HeroSagas {
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero> & GetAllPort<Hero>,
  ) {}

  private everyMinuteForHeroesTimer = interval(1000 * 60).pipe(
    mergeMap(() => from(this.heroPorts.getAll()).pipe(mergeAll())),
  );

  @Saga()
  healHero = (): Observable<ICommand> => {
    return this.everyMinuteForHeroesTimer.pipe(
      filter(doesHeroNeedHealing),
      map(
        ({ id: heroId }) =>
          new HealHeroCommand({
            heroId,
            heal: 1,
          }),
      ),
    );
  };

  @Saga()
  xpGain = (events$: Observable<IEvent>): Observable<ICommand> => {
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
