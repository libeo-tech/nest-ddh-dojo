import { Injectable } from '@nestjs/common';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { HeroFighterPresenter } from '../../../heroes/interface/presenter/hero-fighter.presenter';
import { FighterPorts } from '../../core/domain/fight/fighter.ports';
import { Damage } from '../../core/domain/attack/damage.object-value';
import { HeroFighter } from '../../core/domain/fight/fighter.entity';
import { Result } from 'neverthrow';

@Injectable()
export class HeroAttackHeroAdapter
  implements FighterPorts<HeroFighter, HeroFighter>
{
  constructor(private readonly heroFighterPresenter: HeroFighterPresenter) {}

  public async getAttackStrength(
    id: Hero['id'],
  ): Promise<Result<{ attackValue: number }, Error>> {
    const result = await this.heroFighterPresenter.getAttackStrength(id);
    return result;
  }
  public async receiveDamage(
    id: Hero['id'],
    damage: Damage<HeroFighter>,
  ): Promise<Result<void, Error>> {
    return this.heroFighterPresenter.receiveDamage(id, damage);
  }
  public async isDead(
    id: Hero['id'],
  ): Promise<Result<{ isDead: boolean }, Error>> {
    const isDead = await this.heroFighterPresenter.isDead(id);
    return isDead;
  }
}
