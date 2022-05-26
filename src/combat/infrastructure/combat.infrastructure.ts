import { Dragon } from '../../dragons/core/domain/dragon.entity';
import { DragonPresenter } from '../../dragons/interface/presenter/dragon.presenter';
import { Hero } from '../../heroes/core/domain/hero.entity';
import { HeroPresenter } from '../../heroes/interface/presenter/hero.presenter';
import { Item } from '../../items/core/domain/item.entity';
import { ItemPresenter } from '../../items/interface/presenter/item.presenter';
import { CombatLogIPA } from '../core/domain/combat-log/combat-log.ports';
import { FighterIPA } from '../core/domain/fight/fighter.ports';
import { CombatLogIPAdapter } from './ipa/combat-log.ipa';
import { FighterIPAdapter } from './ipa/fighter.ipa';
import { PveLogAdapter } from './typeorm/pve-log/pve-log.adapter';
import { PveLog } from './typeorm/pve-log/pve-log.orm-entity';
import { PvpLogAdapter } from './typeorm/pvp-log/pvp-log.adapter';
import { PvpLog } from './typeorm/pvp-log/pvp-log.orm-entity';

export const CombatInfrastructure = {
  providers: [
    { provide: Dragon, useClass: DragonPresenter },
    { provide: Hero, useClass: HeroPresenter },
    { provide: Item, useClass: ItemPresenter },
    { provide: FighterIPA, useClass: FighterIPAdapter },
    { provide: CombatLogIPA, useClass: CombatLogIPAdapter },
    PveLogAdapter,
    PvpLogAdapter,
  ],
  repositories: [PveLog, PvpLog],
};
