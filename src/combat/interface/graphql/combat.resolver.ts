import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Dragon } from '../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { CombatSagas } from '../../core/application/sagas/combat.saga';
import { FighterType } from '../../core/domain/fight/fighter.entity';

@Resolver('Combat')
export class CombatResolver {
  constructor(private readonly combatSagas: CombatSagas) {}

  @Mutation()
  public async attackDragon(
    @Args('heroId') heroId: Hero['id'],
    @Args('dragonId') dragonId: Dragon['id'],
  ): Promise<boolean> {
    await this.combatSagas.startCombat({
      attacker: { id: heroId, type: FighterType.HERO },
      defender: { id: dragonId, type: FighterType.DRAGON },
    });
    return true;
  }
}
