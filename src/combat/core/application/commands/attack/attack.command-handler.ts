import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AttackCommand, AttackCommandResult } from './attack.command';
import { FighterIPA } from '../../../domain/fight/fighter.ports';
import { Fighter } from '../../../domain/fight/fighter.entity';
import { err } from 'neverthrow';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { CommandResultEvent } from '../../../../../common/core/domain/command-result.event';

@CommandHandler(AttackCommand)
export class AttackCommandHandler<X extends Fighter, Y extends Fighter>
  implements ICommandHandler<AttackCommand<X, Y>>
{
  constructor(
    private readonly fighterIPA: FighterIPA<X, Y>,
    private readonly eventBus: EventBus,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('CombatModule')
  @LogPayloadAndResult('CombatModule')
  public async execute(
    command: AttackCommand<X, Y>,
  ): Promise<AttackCommandResult> {
    const { fight } = command.payload;
    const { attackerPorts, defenderPorts } = this.fighterIPA.getPorts(fight);
    const { attacker, defender } = fight;

    const attackValueResult = await attackerPorts.getAttackStrength(
      attacker.id,
    );
    if (attackValueResult.isErr()) {
      return err(attackValueResult.error);
    }
    const { attackValue } = attackValueResult.value;

    const receiveDamageResult = await defenderPorts.receiveDamage(defender.id, {
      value: attackValue,
      source: attacker.id,
    });
    if (receiveDamageResult.isErr()) {
      return err(receiveDamageResult.error);
    }

    const isDeadResult = await defenderPorts.isDead(defender.id);
    this.eventBus.publish(new CommandResultEvent(command, isDeadResult));
    return isDeadResult;
  }
}
