import { DragonPorts } from '../core/application/ports/dragon.ports';
import { Dragon } from './typeorm/dragon.orm-entity';
import { DragonAdapter } from './typeorm/dragon.adapter';

export const DragonInfrastructure = {
  providers: [{ provide: DragonPorts, useClass: DragonAdapter }],
  repositories: [Dragon],
};
