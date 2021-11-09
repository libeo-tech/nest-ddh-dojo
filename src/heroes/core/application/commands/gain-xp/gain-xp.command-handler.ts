import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/ports/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroGainedXpEvent } from '../../../domain/hero.events';
import { GainXpCommand } from './gain-xp.command';

@CommandHandler(GainXpCommand)
export class GainXpCommandHandler implements ICommandHandler<GainXpCommand> {
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero> & UpdatePort<Hero>,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(GainXpCommandHandler.name);

  @withSpan()
  public async execute({ payload }: GainXpCommand): Promise<void> {
    this.logger.log(`> GainXpCommand: ${JSON.stringify(payload)}`);
    const { heroId, xpDelta } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }
    await this.heroPorts.update(heroId, { xp: hero.xp + xpDelta });
    await this.eventBus.publish(new HeroGainedXpEvent({ heroId }));
  }
}
