import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Dragon } from '../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { CombatSagas } from '../../core/application/sagas/combat.saga';
import { FighterType } from '../../core/domain/fight/fighter.entity';

@Resolver('combat')
export class CombatResolver {
  private readonly logger = new Logger(CombatResolver.name);

  constructor(private readonly combatSagas: CombatSagas) {}

  @Mutation()
  public async attackDragon(
    @Args('heroId') heroId: Hero['id'],
    @Args('dragonId') dragonId: Dragon['id'],
  ): Promise<boolean> {
    try {
      await this.combatSagas.startCombat({
        attacker: { id: heroId, type: FighterType.HERO },
        defender: { id: dragonId, type: FighterType.DRAGON },
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
