import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { HeroPorts } from '../../ports/hero.ports';
import { CreateHeroCommand } from './create-hero.command';

@CommandHandler(CreateHeroCommand)
export class CreateHeroCommandHandler
  implements ICommandHandler<CreateHeroCommand>
{
  constructor(private readonly heroPorts: HeroPorts) {}

  private readonly logger = new Logger(CreateHeroCommandHandler.name);

  @withSpan()
  public async execute({ payload }: CreateHeroCommand): Promise<void> {
    this.logger.log(`> CreateHeroCommand: ${JSON.stringify(payload)}`);
    const { name } = payload;

    await this.heroPorts.addHero({ name, level: 1 });
  }
}
