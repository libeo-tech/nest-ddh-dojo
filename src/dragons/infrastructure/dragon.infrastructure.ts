import { DragonPorts } from '../core/application/ports/dragon.ports';
import { Dragon } from './dragons/dragon.orm-entity';
import { DragonAdapter } from './dragons/dragon.adapter';

export const DragonInfrastructure = {
  providers: [{ provide: DragonPorts, useClass: DragonAdapter }],
  repositories: [Dragon],
};
