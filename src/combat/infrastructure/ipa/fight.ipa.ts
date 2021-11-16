import { Injectable } from '@nestjs/common';
import { DragonFighterPresenter } from '../../../dragons/interface/presenter/dragon-fighter.presenter';
import { HeroFighterPresenter } from '../../../heroes/interface/presenter/hero-fighter.presenter';
import {
  FighterPorts,
  FightIPA,
} from '../../core/application/ports/fighter.ports';
import { Fight } from '../../core/domain/fight/fight.type';
import {
  Fighter,
  isFighterADragon,
  isFighterAHero,
} from '../../core/domain/fight/fighter.entity';

@Injectable()
export class FightIPAdapter implements FightIPA<Fighter, Fighter> {
  constructor(
    private readonly heroFighterPresenter: HeroFighterPresenter,
    private readonly dragonFighterPresenter: DragonFighterPresenter,
  ) {}

  getPorts(fight: Fight<Fighter, Fighter>): FighterPorts<Fighter, Fighter> {
    const { attacker } = fight;
    if (isFighterAHero(attacker)) {
      return this.heroFighterPresenter;
    }
    if (isFighterADragon(attacker)) {
      return this.dragonFighterPresenter;
    }
    throw new Error(`IPA not implemented for fight ${JSON.stringify(fight)}`);
  }
}
