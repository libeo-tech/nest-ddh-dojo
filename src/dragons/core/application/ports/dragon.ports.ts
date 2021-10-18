import { Dragon } from '../../domain/dragon.entity';

export abstract class DragonPorts {
  abstract getDragon(dragonId: Dragon['id']): Promise<Dragon>;
  abstract getAllDragons(): Promise<Dragon[]>;
  abstract createDragon(dragonProperties: Partial<Dragon>): Promise<Dragon>;
  abstract updateDragon(
    dragonId: Dragon['id'],
    dragonProperties: Partial<Dragon>,
  ): Promise<Dragon>;
  abstract deleteDragon(dragonId: Dragon['id']): Promise<void>;
}
