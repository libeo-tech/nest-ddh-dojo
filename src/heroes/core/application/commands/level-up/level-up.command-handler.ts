import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import {
  HeroDoesNotHaveEnoughXp,
  HeroNotFoundError,
} from '../../../domain/hero.error';
import { getXpNeededForNextLevel } from '../../../domain/xp/xp.service';
import { HeroPorts } from '../../ports/hero.ports';
import { LevelUpCommand } from './level-up.command';

@CommandHandler(LevelUpCommand)
export class LevelUpCommandHandler implements ICommandHandler<LevelUpCommand> {
  constructor(private readonly heroPorts: HeroPorts) {}

  private readonly logger = new Logger(LevelUpCommandHandler.name);

  @withSpan()
  public async execute({ payload }: LevelUpCommand): Promise<void> {
    this.logger.log(`> LevelUpCommand: ${JSON.stringify(payload)}`);
    const { heroId } = payload;

    const hero = await this.heroPorts.getHeroById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }

    const xpForlevelUp = getXpNeededForNextLevel(hero.level);
    if (hero.xp < xpForlevelUp) {
      throw new HeroDoesNotHaveEnoughXp(heroId);
    }

    await this.heroPorts.updateHero(heroId, {
      level: hero.level + 1,
    });
  }
}
