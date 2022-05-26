import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AttackerPorts,
  DefenderPorts,
} from '../../../combat/core/domain/fight/fighter.ports';
import { Damage } from '../../../combat/core/domain/attack/damage.object-value';
import {
  Fighter,
  DragonFighter,
} from '../../../combat/core/domain/fight/fighter.entity';
import {
  HurtDragonCommand,
  HurtDragonCommandResult,
} from '../../core/application/commands/hurt-dragon/hurt-dragon.command';
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
export class DragonFighterPresenter
  implements
    AttackerPorts<DragonFighter>,
    DefenderPorts<DragonFighter, Fighter>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async getAttackStrength(
    dragonId: Dragon['id'],
  ): Promise<GetDragonAttackQueryResult> {
    const result = await this.queryBus.execute<
      GetDragonAttackQuery,
      GetDragonAttackQueryResult
    >(new GetDragonAttackQuery({ dragonId }));
    return result;
  }

  public async receiveDamage(
    dragonId: Dragon['id'],
    damage: Damage<Fighter>,
  ): Promise<HurtDragonCommandResult> {
    const result = await this.commandBus.execute<
      HurtDragonCommand,
      HurtDragonCommandResult
    >(new HurtDragonCommand({ dragonId, damage }));
    return result;
  }

  public async isDead(
    dragonId: Dragon['id'],
  ): Promise<IsDragonDeadQueryResult> {
    const result = await this.queryBus.execute<
      IsDragonDeadQuery,
      IsDragonDeadQueryResult
    >(new IsDragonDeadQuery({ dragonId }));
    return result;
  }
}
