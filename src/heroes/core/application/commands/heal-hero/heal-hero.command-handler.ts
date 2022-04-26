import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { getHeroMaxHp, Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HealHeroCommand } from './heal-hero.command';

@CommandHandler(HealHeroCommand)
export class HealHeroCommandHandler
  implements ICommandHandler<HealHeroCommand>
{
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero> & UpdatePort<Hero>,
  ) {}

  private readonly logger = new Logger(HealHeroCommandHandler.name);

  public async execute({ payload }: HealHeroCommand): Promise<void> {
    this.logger.log(`> HealHeroCommand: ${JSON.stringify(payload)}`);
    const { heroId, heal } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }

    const maxHp = getHeroMaxHp(hero.level);
    const newHp = Math.min(hero.currentHp + heal, maxHp);
    await this.heroPorts.update(heroId, {
      currentHp: newHp,
    });
  }
}
