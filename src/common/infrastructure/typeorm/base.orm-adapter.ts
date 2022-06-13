import { DeepPartial, Repository } from 'typeorm';
import { Base } from '../../core/domain/base.entity';
import { BasePorts } from '../../core/domain/base.ports';
import { BaseOrmEntity } from './base.orm-entity';

export abstract class BaseOrmAdapter<U extends Base, V extends BaseOrmEntity>
  implements BasePorts<U>
{
  abstract mapOrmEntityToEntity(entity: V): U;
  abstract mapEntityPropertiesToOrmEntityProperties(
    entityProperties: Partial<U>,
  ): DeepPartial<V>;
  abstract entitiesRepository: Repository<V>;

  async getById(entityId: U['id']): Promise<U | undefined> {
    const entity = await this.entitiesRepository.findOneById(entityId);
    return !!entity ? this.mapOrmEntityToEntity(entity) : undefined;
  }

  async getAll(): Promise<U[]> {
    const entities = await this.entitiesRepository.find();
    return entities.map(this.mapOrmEntityToEntity);
  }

  async create(entityProperties: Partial<U>): Promise<U> {
    const ormProperties =
      this.mapEntityPropertiesToOrmEntityProperties(entityProperties);
    const entity = await this.entitiesRepository.create(ormProperties);
    await this.entitiesRepository.save(entity);
    return this.mapOrmEntityToEntity(entity);
  }

  async update(
    entityId: U['id'],
    entityProperties: Partial<U>,
  ): Promise<U | undefined> {
    const ormProperties =
      this.mapEntityPropertiesToOrmEntityProperties(entityProperties);
    const entity = await this.entitiesRepository.findOneById(entityId);
    if (!entity) {
      return undefined;
    }
    const updatedEntity = await this.entitiesRepository.save({
      ...entity,
      ...ormProperties,
    });
    return this.mapOrmEntityToEntity(updatedEntity);
  }

  async delete(entityId: U['id']): Promise<void> {
    await this.entitiesRepository.delete(entityId);
  }
}
