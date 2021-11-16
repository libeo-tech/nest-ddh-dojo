import { Injectable } from '@nestjs/common';
import { Dragon } from '../../../dragons/core/domain/dragon.entity';
import { DragonFighterPresenter } from '../../../dragons/interface/presenter/dragon-fighter.presenter';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { HeroFighterPresenter } from '../../../heroes/interface/presenter/hero-fighter.presenter';
import { FighterPorts } from '../../core/application/ports/fighter.ports';
import { Damage } from '../../core/domain/attack/damage.object-value';
import {
  DragonFighter,
  HeroFighter,
} from '../../core/domain/fight/fighter.entity';

@Injectable()
export class HeroAttackDragonAdapter
  implements FighterPorts<HeroFighter, DragonFighter>
{
  constructor(
    private readonly heroFighterPresenter: HeroFighterPresenter,
    private readonly dragonFighterPresenter: DragonFighterPresenter,
  ) {}

  public async getAttackStrength(id: Hero['id']): Promise<number> {
    const attackValue = await this.heroFighterPresenter.getAttackStrength(id);
    return attackValue;
  }
  public async receiveDamage(
    id: Dragon['id'],
    damage: Damage<HeroFighter>,
  ): Promise<void> {
    await this.dragonFighterPresenter.receiveDamage(id, damage);
  }
  public async isDead(id: Dragon['id']): Promise<boolean> {
    const isDead = await this.dragonFighterPresenter.isDead(id);
    return isDead;
  }
}
