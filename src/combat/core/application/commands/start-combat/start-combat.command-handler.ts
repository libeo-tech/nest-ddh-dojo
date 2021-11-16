import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreatePort } from '../../../../../common/core/ports/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { CombatLog } from '../../../domain/combat-log/combat-log.entity';
import { Fighter } from '../../../domain/fight/fighter.entity';
import { CombatLogIPA } from '../../ports/combat-log.ports';
import { NewCombatRoundEvent } from '../../sagas/combat.event';
import { StartCombatCommand } from './start-combat.command';

@CommandHandler(StartCombatCommand)
export class StartCombatCommandHandler<X extends Fighter, Y extends Fighter>
  implements ICommandHandler<StartCombatCommand<X, Y>>
{
  constructor(
    private readonly combatLogIPA: CombatLogIPA<X, Y>,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(StartCombatCommandHandler.name);

  @withSpan()
  public async execute({ payload }: StartCombatCommand<X, Y>): Promise<void> {
    this.logger.log(`> StartCombatCommand: ${JSON.stringify(payload)}`);
    const { attacker, defender } = payload;

    const log = await this.combatLogIPA
      .getPorts(payload)
      .create(attacker.id, defender.id);
    await this.eventBus.publish(
      new NewCombatRoundEvent({ fight: { attacker, defender }, logId: log.id }),
    );
  }
}
