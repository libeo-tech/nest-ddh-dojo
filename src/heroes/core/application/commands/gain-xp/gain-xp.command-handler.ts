import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroGainedXpEvent } from '../../../domain/hero.events';
import { GainXpCommand, GainXpCommandResult } from './gain-xp.command';

@CommandHandler(GainXpCommand)
export class GainXpCommandHandler implements ICommandHandler<GainXpCommand> {
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero> & UpdatePort<Hero>,
    private readonly eventBus: EventBus,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute({
    payload,
  }: GainXpCommand): Promise<GainXpCommandResult> {
    const { heroId, xpGain } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      return err(new HeroNotFoundError(heroId));
    }
    await this.heroPorts.update(heroId, { xp: hero.xp + xpGain });
    await this.eventBus.publish(new HeroGainedXpEvent({ heroId }));
    return ok(void 0);
  }
}
