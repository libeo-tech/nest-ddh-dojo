import { Injectable } from '@nestjs/common';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { HeroFighterPresenter } from '../../../heroes/interface/presenter/hero-fighter.presenter';
import { FighterPorts } from '../../core/domain/fight/fighter.ports';
import { Damage } from '../../core/domain/attack/damage.object-value';
import { HeroFighter } from '../../core/domain/fight/fighter.entity';

@Injectable()
export class HeroAttackHeroAdapter
  implements FighterPorts<HeroFighter, HeroFighter>
{
  constructor(private readonly heroFighterPresenter: HeroFighterPresenter) {}

  public async getAttackStrength(id: Hero['id']): Promise<number> {
    const attackValue = await this.heroFighterPresenter.getAttackStrength(id);
    return attackValue;
  }
  public async receiveDamage(
    id: Hero['id'],
    damage: Damage<HeroFighter>,
  ): Promise<void> {
    await this.heroFighterPresenter.receiveDamage(id, damage);
  }
  public async isDead(id: Hero['id']): Promise<boolean> {
    const isDead = await this.heroFighterPresenter.isDead(id);
    return isDead;
  }
}
