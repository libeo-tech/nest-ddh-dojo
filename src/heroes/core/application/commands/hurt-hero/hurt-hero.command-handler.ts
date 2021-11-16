import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/ports/base.ports';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HurtHeroCommand } from './hurt-hero.command';

@CommandHandler(HurtHeroCommand)
export class HurtHeroCommandHandler
  implements ICommandHandler<HurtHeroCommand>
{
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero> & UpdatePort<Hero>,
  ) {}

  private readonly logger = new Logger(HurtHeroCommandHandler.name);

  public async execute({ payload }: HurtHeroCommand): Promise<void> {
    this.logger.log(`> HurtHeroCommand: ${JSON.stringify(payload)}`);
    const { heroId, damage } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }

    const newHp = hero.currentHp - damage.value;
    await this.heroPorts.update(heroId, {
      currentHp: newHp,
    });
  }
}
