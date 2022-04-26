import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FighterPorts } from '../../../combat/core/domain/fight/fighter.ports';
import { Damage } from '../../../combat/core/domain/attack/damage.object-value';
import {
  Fighter,
  DragonFighter,
} from '../../../combat/core/domain/fight/fighter.entity';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import { HurtDragonCommand } from '../../core/application/commands/hurt-dragon/hurt-dragon.command';
import {
  GetDragonAttackQuery,
  GetDragonAttackQueryResult,
} from '../../core/application/queries/get-dragon-attack/get-dragon-attack.query';
import {
  IsDragonDeadQuery,
  IsDragonDeadQueryResult,
} from '../../core/application/queries/is-dragon-dead/is-dragon-dead.query';
import { Dragon } from '../../core/domain/dragon.entity';

@Injectable()
@withSpans()
export class DragonFighterPresenter
  implements FighterPorts<DragonFighter, Fighter>
{
  private readonly logger = new Logger(DragonFighterPresenter.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async getAttackStrength(dragonId: Dragon['id']): Promise<number> {
    const { attackValue } = await this.queryBus.execute<
      GetDragonAttackQuery,
      GetDragonAttackQueryResult
    >(new GetDragonAttackQuery({ dragonId }));
    return attackValue;
  }

  public async receiveDamage(
    dragonId: Dragon['id'],
    damage: Damage<Fighter>,
  ): Promise<void> {
    await this.commandBus.execute<HurtDragonCommand>(
      new HurtDragonCommand({ dragonId, damage }),
    );
  }

  public async isDead(dragonId: Dragon['id']): Promise<boolean> {
    const { isDead } = await this.queryBus.execute<
      IsDragonDeadQuery,
      IsDragonDeadQueryResult
    >(new IsDragonDeadQuery({ dragonId }));
    return isDead;
  }
}
