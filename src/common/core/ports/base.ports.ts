import { Base } from '../domain/base.entity';

export interface GetById<T extends Base> {
  getById(id: T['id']): Promise<T | undefined>;
}

export interface GetAll<T extends Base> {
  getAll(): Promise<T[]>;
}

export interface Update<T extends Base> {
  update(entityId: T['id'], properties: Partial<T>): Promise<T | undefined>;
}

export interface Create<T extends Base> {
  create(properties: Partial<T>): Promise<T>;
}

export interface Delete<T extends Base> {
  delete(id: T['id']): Promise<void>;
}

export abstract class BasePorts<T extends Base>
  implements GetById<T>, GetAll<T>, Create<T>, Update<T>, Delete<T>
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
