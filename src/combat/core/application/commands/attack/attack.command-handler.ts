import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AttackCommand, AttackCommandResult } from './attack.command';
import { FighterIPA } from '../../../domain/fight/fighter.ports';
import { Fighter } from '../../../domain/fight/fighter.entity';
import { err, ok } from 'neverthrow';
import { UnknownError } from '../../../../../common/core/domain/base.error';

@CommandHandler(AttackCommand)
export class AttackCommandHandler<X extends Fighter, Y extends Fighter>
  implements ICommandHandler<AttackCommand<X, Y>>
{
  constructor(private readonly fighterIPA: FighterIPA<X, Y>) {}

  private readonly logger = new Logger(AttackCommandHandler.name);

  public async execute(
    command: AttackCommand<X, Y>,
  ): Promise<AttackCommandResult> {
    this.logger.log(`> AttackCommand: ${JSON.stringify(command.payload)}`);

    const { fight } = command.payload;
    const fighterPorts = this.fighterIPA.getPorts(fight);
    const { attacker, defender } = fight;

    const attackValueResult = await fighterPorts.getAttackStrength(attacker.id);
    if (attackValueResult.isErr()) {
      return err(attackValueResult.error);
    }
    const { attackValue } = attackValueResult.value;

    const receiveDamageResult = await fighterPorts.receiveDamage(defender.id, {
      value: attackValue,
      source: attacker.id,
    });
    if (receiveDamageResult.isErr()) {
      return err(receiveDamageResult.error);
    }

    command.end();
    return ok(void 0);
  }
}
