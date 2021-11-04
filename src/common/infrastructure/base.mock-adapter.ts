import { Base } from '../core/domain/base.entity';
import { BasePorts } from '../core/ports/base.ports';

export abstract class MockAdapter<T extends Base> implements BasePorts<T> {
  abstract entityName: string;
  abstract entityFactory(properties: Partial<T>): T;
  currentId = 0;
  entities: Record<T['id'], T> = {} as Record<T['id'], T>;
  getAll(): Promise<T[]> {
    return Promise.resolve(Object.values(this.entities));
  }
  getById(entityId: T['id']): Promise<T | undefined> {
    return Promise.resolve(this.entities[entityId]);
  }
  create(entityProperties: Partial<T>): Promise<T> {
    const newItem = this.entityFactory(entityProperties);
    const id = newItem.id ?? `${this.entityName}${this.currentId++}`;
    this.entities[id] = { ...newItem, id };
    return Promise.resolve(this.entities[id]);
  }
  update(
    entityId: T['id'],
    entityProperties: Partial<T>,
  ): Promise<T | undefined> {
    this.entities[entityId] = {
      ...this.entities[entityId],
      ...entityProperties,
    };
    return Promise.resolve(this.entities[entityId]);
  }
  delete(entityId: T['id']): Promise<void> {
    delete this.entities[entityId];
    return Promise.resolve();
  }
}
