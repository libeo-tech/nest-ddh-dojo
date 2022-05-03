import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GainXpCommand } from '../../core/application/commands/gain-xp/gain-xp.command';
import { Hero } from '../../core/domain/hero.entity';

@Injectable()
export class HeroPresenter {
  private readonly logger = new Logger(HeroPresenter.name);

  constructor(private readonly commandBus: CommandBus) {}

  public async gainXp(heroId: Hero['id'], xpGain: Hero['xp']): Promise<void> {
    await this.commandBus.execute<GainXpCommand>(
      new GainXpCommand({ heroId, xpGain }),
    );
  }
}
