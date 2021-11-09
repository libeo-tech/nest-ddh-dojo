import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePort } from '../../../../../common/core/ports/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Hero } from '../../../domain/hero.entity';
import { CreateHeroCommand } from './create-hero.command';

@CommandHandler(CreateHeroCommand)
export class CreateHeroCommandHandler
  implements ICommandHandler<CreateHeroCommand>
{
  constructor(@Inject(Hero) private readonly heroPorts: CreatePort<Hero>) {}

  private readonly logger = new Logger(CreateHeroCommandHandler.name);

  @withSpan()
  public async execute({ payload }: CreateHeroCommand): Promise<void> {
    this.logger.log(`> CreateHeroCommand: ${JSON.stringify(payload)}`);
    const { name } = payload;

    await this.heroPorts.create({ name, level: 1 });
  }
}
