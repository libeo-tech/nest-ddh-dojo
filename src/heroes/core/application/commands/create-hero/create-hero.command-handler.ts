import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ok } from 'neverthrow';
import { CreatePort } from '../../../../../common/core/domain/base.ports';
import { Hero } from '../../../domain/hero.entity';
import {
  CreateHeroCommand,
  CreateHeroCommandResult,
} from './create-hero.command';

@CommandHandler(CreateHeroCommand)
export class CreateHeroCommandHandler
  implements ICommandHandler<CreateHeroCommand>
{
  constructor(@Inject(Hero) private readonly heroPorts: CreatePort<Hero>) {}

  private readonly logger = new Logger(CreateHeroCommandHandler.name);

  public async execute({
    payload,
  }: CreateHeroCommand): Promise<CreateHeroCommandResult> {
    this.logger.log(`> CreateHeroCommand: ${JSON.stringify(payload)}`);
    const { name } = payload;

    const hero = await this.heroPorts.create({ name, level: 1 });
    return ok(hero);
  }
}
