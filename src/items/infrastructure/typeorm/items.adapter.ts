import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BaseOrmAdapter } from '../../../common/infrastructure/base.orm-adapter';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { Item } from '../../core/domain/item.entity';
import { Item as ItemOrmEntity } from './item.orm-entity';
import { mapItemOrmEntityToItemEntity } from './item.orm-mapper';

@Injectable()
@withSpans()
export class ItemAdapter extends BaseOrmAdapter<Item, ItemOrmEntity> {
  mapOrmEntityToEntity = mapItemOrmEntityToItemEntity;
  mapEntityPropertiesToOrmEntityProperties = (
    entityProperties: Partial<Item>,
  ): DeepPartial<ItemOrmEntity> => entityProperties;
  entitiesRepository = this.itemsRepository;
  constructor(
    @InjectRepository(ItemOrmEntity)
    private itemsRepository: Repository<ItemOrmEntity>,
  ) {
    super();
  }

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
}
