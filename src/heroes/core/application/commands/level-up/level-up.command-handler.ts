import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroPorts } from '../../ports/hero.ports';
import { LevelUpCommand } from './level-up.command';

@CommandHandler(LevelUpCommand)
export class LevelUpCommandHandler implements ICommandHandler<LevelUpCommand> {
  constructor(private readonly heroPorts: HeroPorts) {}

  private readonly logger = new Logger(LevelUpCommandHandler.name);

  public async execute({ payload }: LevelUpCommand): Promise<void> {
    this.logger.log(`> LevelUpCommand: ${JSON.stringify(payload)}`);
    const { heroId } = payload;

    const hero = await this.heroPorts.getHeroById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }
    await this.heroPorts.updateHero(heroId, { level: hero.level + 1 });
  }
}
