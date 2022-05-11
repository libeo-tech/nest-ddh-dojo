import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
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

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute({
    payload,
  }: LevelUpCommand): Promise<LevelUpCommandResult> {
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      return err(new HeroNotFoundError(heroId));
    }

    const xpForLevelUp = getXpNeededForNextLevel(hero.level);
    if (hero.xp < xpForLevelUp) {
      return err(new HeroDoesNotHaveEnoughXp(heroId));
    }

    await this.heroPorts.update(heroId, {
      level: hero.level + 1,
    });
    return ok(void 0);
  }
}
