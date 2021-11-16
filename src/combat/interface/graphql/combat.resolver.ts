import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { withSpan } from '../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { StartCombatCommand } from '../../core/application/commands/start-combat/start-combat.command';
import {
  DragonFighter,
  FighterType,
  HeroFighter,
} from '../../core/domain/fight/fighter.entity';

@Resolver('combat')
export class CombatResolver {
  private readonly logger = new Logger(CombatResolver.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Mutation()
  @withSpan()
  public async attackDragon(
    @Args('heroId') heroId: Hero['id'],
    @Args('dragonId') dragonId: Dragon['id'],
  ): Promise<boolean> {
    try {
      await this.commandBus.execute<
        StartCombatCommand<HeroFighter, DragonFighter>
      >(
        new StartCombatCommand<HeroFighter, DragonFighter>({
          attacker: { id: heroId, type: FighterType.HERO },
          defender: { id: dragonId, type: FighterType.DRAGON },
        }),
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
