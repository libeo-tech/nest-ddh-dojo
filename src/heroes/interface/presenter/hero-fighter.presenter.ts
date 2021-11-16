import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FighterPorts } from '../../../combat/core/application/ports/fighter.ports';
import { Damage } from '../../../combat/core/domain/attack/damage.object-value';
import {
  Fighter,
  HeroFighter,
} from '../../../combat/core/domain/fight/fighter.entity';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import { HurtHeroCommand } from '../../core/application/commands/hurt-hero/hurt-hero.command';
import {
  GetHeroAttackQuery,
  GetHeroAttackQueryResult,
} from '../../core/application/queries/get-hero-attack/get-hero-attack.query';
import {
  IsHeroDeadQuery,
  IsHeroDeadQueryResult,
} from '../../core/application/queries/is-hero-dead/is-hero-dead.query';
import { Hero } from '../../core/domain/hero.entity';

@Injectable()
@withSpans()
export class HeroFighterPresenter
  implements FighterPorts<HeroFighter, Fighter>
{
  private readonly logger = new Logger(HeroFighterPresenter.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async getAttackStrength(heroId: Hero['id']): Promise<number> {
    const { attackValue } = await this.queryBus.execute<
      GetHeroAttackQuery,
      GetHeroAttackQueryResult
    >(new GetHeroAttackQuery({ heroId }));
    return attackValue;
  }

  public async inflictDamage(
    heroId: Hero['id'],
    damage: Damage<Fighter>,
  ): Promise<void> {
    await this.commandBus.execute<HurtHeroCommand>(
      new HurtHeroCommand({ heroId, damage }),
    );
  }

  public async isDead(heroId: Hero['id']): Promise<boolean> {
    const { isDead } = await this.queryBus.execute<
      IsHeroDeadQuery,
      IsHeroDeadQueryResult
    >(new IsHeroDeadQuery({ heroId }));
    return isDead;
  }
}
