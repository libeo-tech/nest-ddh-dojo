import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  GainXpCommand,
  GainXpCommandResult,
} from '../../core/application/commands/gain-xp/gain-xp.command';
import { Hero } from '../../core/domain/hero.entity';

@Injectable()
export class HeroPresenter {
  private readonly logger = new Logger(HeroPresenter.name);

  constructor(private readonly commandBus: CommandBus) {}

  public async gainXp(
    heroId: Hero['id'],
    xpGain: Hero['xp'],
  ): Promise<GainXpCommandResult> {
    const result = await this.commandBus.execute<
      GainXpCommand,
      GainXpCommandResult
    >(new GainXpCommand({ heroId, xpGain }));
    return result;
  }
}
