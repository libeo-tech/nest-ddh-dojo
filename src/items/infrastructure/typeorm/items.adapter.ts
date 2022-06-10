import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { BaseOrmAdapter } from '../../../common/infrastructure/base.orm-adapter';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { ItemWithOwnerPorts } from '../../core/domain/item-with-owner.ports';
import { Item } from '../../core/domain/item.entity';
import { Item as ItemOrmEntity } from './item.orm-entity';
import { mapItemOrmEntityToItemEntity } from './item.orm-mapper';

@Injectable()
export class ItemAdapter
  extends BaseOrmAdapter<Item, ItemOrmEntity>
  implements ItemWithOwnerPorts
{
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
    const item = await this.itemsRepository.findOneById(itemId);
    item.ownerId = ownerId;
    await this.itemsRepository.save(item);
  }

  async getItemsByOwnerId(ownerId: Hero['id']): Promise<Item[]> {
    const items = await this.itemsRepository.find({
      where: { ownerId: In([ownerId]) },
    });
    return items.map(mapItemOrmEntityToItemEntity);
  }
}
