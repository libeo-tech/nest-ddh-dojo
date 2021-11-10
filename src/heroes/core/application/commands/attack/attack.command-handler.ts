import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { GetByIdPort } from '../../../../../common/core/ports/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { HeroAttackedTargetEvent } from '../../../domain/attack/attack.event';
import { getHeroAttackStrength } from '../../../domain/attack/attack.service';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { AttackCommand } from './attack.command';

@CommandHandler(AttackCommand)
export class AttackCommandHandler implements ICommandHandler<AttackCommand> {
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetByIdPort<Hero>,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(AttackCommandHandler.name);

  @withSpan()
  public async execute({ payload }: AttackCommand): Promise<void> {
    this.logger.log(`> AttackCommand: ${JSON.stringify(payload)}`);
    const { heroId, targetId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }

    const attackValue = getHeroAttackStrength(hero);
    this.eventBus.publish(
      new HeroAttackedTargetEvent({ heroId, targetId, attackValue }),
    );
  }
}
