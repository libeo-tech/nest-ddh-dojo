import { Injectable } from '@nestjs/common';
import { Dragon } from '../../../dragons/core/domain/dragon.entity';
import { DragonFighterPresenter } from '../../../dragons/interface/presenter/dragon-fighter.presenter';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { HeroFighterPresenter } from '../../../heroes/interface/presenter/hero-fighter.presenter';
import { FighterPorts } from '../../core/domain/fight/fighter.ports';
import { Damage } from '../../core/domain/attack/damage.object-value';
import {
  DragonFighter,
  HeroFighter,
} from '../../core/domain/fight/fighter.entity';
import { Result } from 'neverthrow';

@Injectable()
export class DragonAttackHeroAdapter
  implements FighterPorts<DragonFighter, HeroFighter>
{
  constructor(
    private readonly heroFighterPresenter: HeroFighterPresenter,
    private readonly dragonFighterPresenter: DragonFighterPresenter,
  ) {}

  public async getAttackStrength(
    id: Dragon['id'],
  ): Promise<Result<{ attackValue: number }, Error>> {
    return this.dragonFighterPresenter.getAttackStrength(id);
  }
  public async receiveDamage(
    id: Hero['id'],
    damage: Damage<DragonFighter>,
  ): Promise<Result<void, Error>> {
    return this.heroFighterPresenter.receiveDamage(id, damage);
  }
  public async isDead(
    id: Hero['id'],
  ): Promise<Result<{ isDead: boolean }, Error>> {
    return this.heroFighterPresenter.isDead(id);
  }
}
