import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { Hero } from '../../../domain/hero.entity';
import {
  HeroDoesNotHaveEnoughXp,
  HeroNotFoundError,
} from '../../../domain/hero.error';
import { getXpNeededForNextLevel } from '../../../domain/xp/xp.service';
import { LevelUpCommand, LevelUpCommandResult } from './level-up.command';

@CommandHandler(LevelUpCommand)
export class LevelUpCommandHandler implements ICommandHandler<LevelUpCommand> {
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero> & UpdatePort<Hero>,
  ) {}

  private readonly logger = new Logger(LevelUpCommandHandler.name);

  public async execute({
    payload,
  }: LevelUpCommand): Promise<LevelUpCommandResult> {
    this.logger.log(`> LevelUpCommand: ${JSON.stringify(payload)}`);
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      return err(new HeroNotFoundError(heroId));
    }

    const xpForlevelUp = getXpNeededForNextLevel(hero.level);
    if (hero.xp < xpForlevelUp) {
      return err(new HeroDoesNotHaveEnoughXp(heroId));
    }

    await this.heroPorts.update(heroId, {
      level: hero.level + 1,
    });
    return ok(void 0);
  }
}
