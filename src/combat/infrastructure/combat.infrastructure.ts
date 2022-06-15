import { Dragon } from '../../dragons/core/domain/dragon.entity';
import { DragonPresenter } from '../../dragons/interface/presenter/dragon.presenter';
import { Hero } from '../../heroes/core/domain/hero.entity';
import { HeroPresenter } from '../../heroes/interface/presenter/hero.presenter';
import { Item } from '../../items/core/domain/item.entity';
import { ItemPresenter } from '../../items/interface/presenter/item.presenter';
import { PrismaService } from '../../prisma/prisma.service';
import { CombatLogIPA } from '../core/domain/combat-log/combat-log.ports';
import { FighterIPA } from '../core/domain/fight/fighter.ports';
import { CombatLogIPAdapter } from './ipa/combat-log.ipa';
import { FighterIPAdapter } from './ipa/fighter.ipa';
import { PveLogAdapter } from './prisma/pve-log/pve-log.adapter';
import { PvpLogAdapter } from './prisma/pvp-log/pvp-log.adapter';

export const CombatInfrastructure = {
  providers: [
    PrismaService,
    { provide: Dragon, useClass: DragonPresenter },
    { provide: Hero, useClass: HeroPresenter },
    { provide: Item, useClass: ItemPresenter },
    { provide: FighterIPA, useClass: FighterIPAdapter },
    { provide: CombatLogIPA, useClass: CombatLogIPAdapter },
    PveLogAdapter,
    PvpLogAdapter,
  ],
};
