import { Injectable } from '@nestjs/common';
import {
  FighterPorts,
  FighterIPA,
} from '../../core/domain/fight/fighter.ports';
import { Fight } from '../../core/domain/fight/fight.type';
import {
  Fighter,
  isFighterADragon,
  isFighterAHero,
} from '../../core/domain/fight/fighter.entity';
import { DragonAttackHeroAdapter } from '../presenter/dragon-attack-hero.adapter';
import { HeroAttackDragonAdapter } from '../presenter/hero-attack-dragon.adapter';
import { HeroAttackHeroAdapter } from '../presenter/hero-attack-hero.adapter';

@Injectable()
export class FightIPAdapter implements FighterIPA<Fighter, Fighter> {
  constructor(
    private readonly heroAttackDragonAdapter: HeroAttackDragonAdapter,
    private readonly dragonAttackHeroAdapter: DragonAttackHeroAdapter,
    private readonly heroAttackHeroAdapter: HeroAttackHeroAdapter,
  ) {}

  getPorts(fight: Fight<Fighter, Fighter>): FighterPorts<Fighter, Fighter> {
    const { attacker, defender } = fight;
    if (isFighterAHero(attacker) && isFighterADragon(defender)) {
      return this.heroAttackDragonAdapter;
    }
    if (isFighterADragon(attacker) && isFighterAHero(defender)) {
      return this.dragonAttackHeroAdapter;
    }
    if (isFighterAHero(attacker) && isFighterAHero(defender)) {
      return this.heroAttackHeroAdapter;
    }
    throw new Error(`IPA not implemented for fight ${JSON.stringify(fight)}`);
  }
}
