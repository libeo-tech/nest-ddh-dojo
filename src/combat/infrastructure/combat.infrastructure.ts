import { Dragon } from '../../dragons/core/domain/dragon.entity';
import { DragonPresenter } from '../../dragons/interface/presenter/dragon.presenter';
import { Hero } from '../../heroes/core/domain/hero.entity';
import { HeroPresenter } from '../../heroes/interface/presenter/hero.presenter';
import { Item } from '../../items/core/domain/item.entity';
import { ItemPresenter } from '../../items/interface/presenter/item.presenter';
import { CombatLogIPA } from '../core/application/ports/combat-log.ports';
import { FightIPA } from '../core/application/ports/fighter.ports';
import { CombatLogIPAdapter } from './ipa/combat-log.ipa';
import { FightIPAdapter } from './ipa/fight.ipa';
import { DragonAttackHeroAdapter } from './presenter/dragon-attack-hero.adapter';
import { HeroAttackDragonAdapter } from './presenter/hero-attack-dragon.adapter';
import { HeroAttackHeroAdapter } from './presenter/hero-attack-hero.adapter';
import { PveLogAdapter } from './typeorm/pve-log/pve-log.adapter';
import { PveLog } from './typeorm/pve-log/pve-log.orm-entity';
import { PvpLogAdapter } from './typeorm/pvp-log/pvp-log.adapter';
import { PvpLog } from './typeorm/pvp-log/pvp-log.orm-entity';

export const CombatInfrastructure = {
  providers: [
    { provide: Dragon, useClass: DragonPresenter },
    { provide: Hero, useClass: HeroPresenter },
    { provide: Item, useClass: ItemPresenter },
    { provide: FightIPA, useClass: FightIPAdapter },
    { provide: CombatLogIPA, useClass: CombatLogIPAdapter },
    PveLogAdapter,
    PvpLogAdapter,
    HeroAttackDragonAdapter,
    DragonAttackHeroAdapter,
    HeroAttackHeroAdapter,
  ],
  repositories: [PveLog, PvpLog],
};
