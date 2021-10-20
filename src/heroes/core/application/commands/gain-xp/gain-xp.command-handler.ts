import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroGainedXpEvent } from '../../../domain/hero.events';
import { HeroPorts } from '../../ports/hero.ports';
import { GainXpCommand } from './gain-xp.command';

@CommandHandler(GainXpCommand)
export class GainXpCommandHandler implements ICommandHandler<GainXpCommand> {
  constructor(
    private readonly heroPorts: HeroPorts,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(GainXpCommandHandler.name);

  public async execute({ payload }: GainXpCommand): Promise<void> {
    this.logger.log(`> GainXpCommand: ${JSON.stringify(payload)}`);
    const { heroId, xpDelta } = payload;

    const hero = await this.heroPorts.getHeroById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }
    await this.heroPorts.updateHero(heroId, { xp: hero.xp + xpDelta });
    await this.eventBus.publish(new HeroGainedXpEvent({ heroId }));
  }
}
