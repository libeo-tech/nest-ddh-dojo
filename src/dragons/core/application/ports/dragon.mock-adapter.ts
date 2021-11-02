import { Dragon } from '../../domain/dragon.entity';
import { dragonEntityFactory } from '../../domain/dragon.entity-factory';
import { DragonPorts } from './dragon.ports';

export class DragonMockAdapter implements DragonPorts {
  currentId = 0;
  dragons: Record<Dragon['id'], Dragon> = {} as Record<Dragon['id'], Dragon>;
  getAllDragons(): Promise<Dragon[]> {
    return Promise.resolve(Object.values(this.dragons));
  }
  getDragonById(dragonId: Dragon['id']): Promise<Dragon | undefined> {
    return Promise.resolve(this.dragons[dragonId]);
  }
  createDragon(dragonProperties: Partial<Dragon>): Promise<Dragon> {
    const newDragon = dragonEntityFactory(dragonProperties);
    const id = newDragon.id ?? `dragon${this.currentId++}`;
    this.dragons[id] = { ...newDragon, id };
    return Promise.resolve(this.dragons[id]);
  }
  updateDragon(
    dragonId: Dragon['id'],
    dragonProperties: Partial<Dragon>,
  ): Promise<Dragon | undefined> {
    this.dragons[dragonId] = { ...this.dragons[dragonId], ...dragonProperties };
    return Promise.resolve(this.dragons[dragonId]);
  }
  deleteDragon(dragonId: Dragon['id']): Promise<void> {
    delete this.dragons[dragonId];
    return Promise.resolve();
  }
}
