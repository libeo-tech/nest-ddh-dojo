import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { ItemPorts } from '../../core/application/ports/item.ports';
import { Item } from '../../core/domain/item.entity';
import { Item as ItemOrmEntity } from './item.orm-entity';
import { mapItemOrmEntityToItemEntity } from './item.orm-mapper';

@Injectable()
@withSpans()
export class ItemAdapter implements ItemPorts {
  constructor(
    @InjectRepository(ItemOrmEntity)
    private itemsRepository: Repository<ItemOrmEntity>,
  ) {}

  async attributeOwnerOfItem(
    itemId: Item['id'],
    ownerId: Hero['id'],
  ): Promise<void> {
    await this.itemsRepository.update(itemId, { ownerId });
  }

  async getItemsByOwnerId(ownerId: Hero['id']): Promise<Item[]> {
    const items = await this.itemsRepository.find({ ownerId });
    return items.map(mapItemOrmEntityToItemEntity);
  }

  async getById(itemId: Item['id']): Promise<Item | undefined> {
    const item = await this.itemsRepository.findOne(itemId);
    return !!item ? mapItemOrmEntityToItemEntity(item) : undefined;
  }

  async getAll(): Promise<Item[]> {
    const items = await this.itemsRepository.find();
    return items.map(mapItemOrmEntityToItemEntity);
  }

  async create(itemProperties: Partial<Item>): Promise<Item> {
    const item = await this.itemsRepository.save(itemProperties);
    return mapItemOrmEntityToItemEntity(item);
  }

  async update(
    itemId: Item['id'],
    itemProperties: Partial<Item>,
  ): Promise<Item | undefined> {
    await this.itemsRepository.update(itemId, itemProperties);
    const item = await this.itemsRepository.findOne(itemId);
    return !!item ? mapItemOrmEntityToItemEntity(item) : undefined;
  }

  async delete(itemId: Item['id']): Promise<void> {
    await this.itemsRepository.delete(itemId);
  }
}
