import { Injectable } from '@nestjs/common';
import {
  AttackerPorts,
  DefenderPorts,
  FighterIPA,
} from '../../core/domain/fight/fighter.ports';
import {
  Fighter,
  isFighterADragon,
  isFighterAHero,
} from '../../core/domain/fight/fighter.entity';
import { HeroFighterPresenter } from '../../../heroes/interface/presenter/hero-fighter.presenter';
import { DragonFighterPresenter } from '../../../dragons/interface/presenter/dragon-fighter.presenter';
import { Fight } from '../../core/domain/fight/fight.type';

@Injectable()
export class FighterIPAdapter implements FighterIPA<Fighter, Fighter> {
  constructor(
    private readonly heroAdapter: HeroFighterPresenter,
    private readonly dragonAdapter: DragonFighterPresenter,
  ) {}

  getPorts(fight: Fight<Fighter, Fighter>): {
    attackerPorts: AttackerPorts<Fighter>;
    defenderPorts: DefenderPorts<Fighter, Fighter>;
  } {
    return {
      attackerPorts: this.getAttackerPorts(fight.attacker),
      defenderPorts: this.getDefenderPorts(fight.defender),
    };
  }

  private getAttackerPorts(fighter: Fighter): AttackerPorts<Fighter> {
    if (isFighterAHero(fighter)) {
      return this.heroAdapter;
    }
    if (isFighterADragon(fighter)) {
      return this.dragonAdapter;
    }
    throw new Error(
      `IPA not implemented for fighter ${JSON.stringify(fighter)}`,
    );
  }

  private getDefenderPorts(fighter: Fighter): DefenderPorts<Fighter, Fighter> {
    if (isFighterAHero(fighter)) {
      return this.heroAdapter;
    }
    if (isFighterADragon(fighter)) {
      return this.dragonAdapter;
    }
    throw new Error(
      `IPA not implemented for fighter ${JSON.stringify(fighter)}`,
    );
  }
}
