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
export class HeroAttackDragonAdapter
  implements FighterPorts<HeroFighter, DragonFighter>
{
  constructor(
    private readonly heroFighterPresenter: HeroFighterPresenter,
    private readonly dragonFighterPresenter: DragonFighterPresenter,
  ) {}

  public async getAttackStrength(
    id: Hero['id'],
  ): Promise<Result<{ attackValue: number }, Error>> {
    const result = await this.heroFighterPresenter.getAttackStrength(id);
    return result;
  }
  public async receiveDamage(
    id: Dragon['id'],
    damage: Damage<HeroFighter>,
  ): Promise<Result<void, Error>> {
    return this.dragonFighterPresenter.receiveDamage(id, damage);
  }
  public async isDead(
    id: Dragon['id'],
  ): Promise<Result<{ isDead: boolean }, Error>> {
    const isDead = await this.dragonFighterPresenter.isDead(id);
    return isDead;
  }
}
