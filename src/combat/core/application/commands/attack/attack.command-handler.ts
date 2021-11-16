import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { AttackCommand } from './attack.command';
import { FighterIPA } from '../../ports/fighter.ports';
import { Fighter } from '../../../domain/fight/fighter.entity';

@CommandHandler(AttackCommand)
export class AttackCommandHandler<X extends Fighter, Y extends Fighter>
  implements ICommandHandler<AttackCommand<X, Y>>
{
  constructor(private readonly fighterIPA: FighterIPA<X, Y>) {}

  private readonly logger = new Logger(AttackCommandHandler.name);

  @withSpan()
  public async execute(command: AttackCommand<X, Y>): Promise<void> {
    this.logger.log(`> AttackCommand: ${JSON.stringify(command.payload)}`);
    const { fight } = command.payload;
    const fighterPorts = this.fighterIPA.getPorts(fight);
    const { attacker, defender } = fight;

    const attackValue = await fighterPorts.getAttackStrength(attacker.id);
    await fighterPorts.receiveDamage(defender.id, {
      value: attackValue,
      source: attacker.id,
    });

    command.end();
  }
}
