import { Dragon as DragonOrmEntity } from './typeorm/dragon.orm-entity';
import { DragonAdapter } from './typeorm/dragon.adapter';
import { Dragon } from '../core/domain/dragon.entity';

export const DragonInfrastructure = {
  providers: [{ provide: Dragon, useClass: DragonAdapter }],
  repositories: [DragonOrmEntity],
};
