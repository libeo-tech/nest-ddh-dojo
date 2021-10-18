import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { ItemPorts } from '../../core/application/ports/item.ports';
import { Item } from '../../core/domain/item.entity';
import { Item as ItemOrmEntity } from './item.orm-entity';
import { mapItemOrmEntityToItemEntity } from './item.orm-mapper';

@Injectable()
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

  async getItemById(itemId: Item['id']): Promise<Item> {
    const item = await this.itemsRepository.findOne(itemId);
    return mapItemOrmEntityToItemEntity(item);
  }

  async getAllItems(): Promise<Item[]> {
    const items = await this.itemsRepository.find();
    return items.map(mapItemOrmEntityToItemEntity);
  }

  async createItem(itemProperties: Partial<Item>): Promise<Item> {
    const item = await this.itemsRepository.save(itemProperties);
    return mapItemOrmEntityToItemEntity(item);
  }

  async deleteItem(itemId: Item['id']): Promise<void> {
    await this.itemsRepository.delete(itemId);
  }
}
