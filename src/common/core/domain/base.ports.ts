import { Base } from './base.entity';

export interface GetByIdPort<T extends Base> {
  getById(id: T['id']): Promise<T | undefined>;
}

export interface GetAllPort<T extends Base> {
  getAll(): Promise<T[]>;
}

export interface UpdatePort<T extends Base> {
  update(entityId: T['id'], properties: Partial<T>): Promise<T | undefined>;
}

export interface CreatePort<T extends Base> {
  create(properties: Partial<T>): Promise<T>;
}

export interface DeletePort<T extends Base> {
  delete(id: T['id']): Promise<void>;
}

export abstract class BasePorts<T extends Base>
  implements
    GetByIdPort<T>,
    GetAllPort<T>,
    CreatePort<T>,
    UpdatePort<T>,
    DeletePort<T>
{
  abstract getById(id: T['id']): Promise<T | undefined>;
  abstract getAll(): Promise<T[]>;
  abstract create(properties: Partial<T>): Promise<T>;
  abstract update(
    entityId: T['id'],
    properties: Partial<T>,
  ): Promise<T | undefined>;
  abstract delete(id: T['id']): Promise<void>;
}
