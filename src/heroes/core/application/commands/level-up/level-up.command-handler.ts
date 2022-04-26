import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Hero } from '../../../domain/hero.entity';
import {
  HeroDoesNotHaveEnoughXp,
  HeroNotFoundError,
} from '../../../domain/hero.error';
import { getXpNeededForNextLevel } from '../../../domain/xp/xp.service';
import { LevelUpCommand } from './level-up.command';

@CommandHandler(LevelUpCommand)
export class LevelUpCommandHandler implements ICommandHandler<LevelUpCommand> {
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero> & UpdatePort<Hero>,
  ) {}

  private readonly logger = new Logger(LevelUpCommandHandler.name);

  @withSpan()
  public async execute({ payload }: LevelUpCommand): Promise<void> {
    this.logger.log(`> LevelUpCommand: ${JSON.stringify(payload)}`);
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }

    const xpForlevelUp = getXpNeededForNextLevel(hero.level);
    if (hero.xp < xpForlevelUp) {
      throw new HeroDoesNotHaveEnoughXp(heroId);
    }

    await this.heroPorts.update(heroId, {
      level: hero.level + 1,
    });
  }
}
