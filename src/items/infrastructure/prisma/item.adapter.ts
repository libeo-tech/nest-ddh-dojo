import { Injectable } from '@nestjs/common';
import { BasePorts } from '../../../common/core/domain/base.ports';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { ItemWithOwnerPorts } from '../../core/domain/item-with-owner.ports';
import { Item } from '../../core/domain/item.entity';
import {
  mapItemOrmEntityToItemEntity,
  mapEntityPropertiesToOrmEntityProperties,
} from './item.orm-mapper';

@Injectable()
export class ItemAdapter implements BasePorts<Item>, ItemWithOwnerPorts {
  constructor(private prisma: PrismaService) {}

  async getById(id: Item['id']): Promise<Item> {
    const item = await this.prisma.item.findFirst({ where: { id } });

    return mapItemOrmEntityToItemEntity(item);
  }

  async getAll(): Promise<Item[]> {
    const items = await this.prisma.item.findMany();

    return items.map(mapItemOrmEntityToItemEntity);
  }

  async create(properties: Omit<Item, 'id'>): Promise<Item> {
    const item = await this.prisma.item.create({
      data: properties,
    });

    return mapItemOrmEntityToItemEntity(item);
  }

  async update(entityId: Item['id'], properties: Partial<Item>): Promise<Item> {
    const item = await this.prisma.item.update({
      where: { id: entityId },
      data: mapEntityPropertiesToOrmEntityProperties(properties),
    });

    return mapItemOrmEntityToItemEntity(item);
  }

  async delete(id: Item['id']): Promise<void> {
    await this.prisma.item.delete({ where: { id } });
  }

  async getItemsByOwnerId(ownerId: Hero['id']): Promise<Item[]> {
    const inventory = await this.prisma.item.findMany({ where: { ownerId } });
    return inventory.map(mapItemOrmEntityToItemEntity);
  }
  async attributeOwnerOfItem(
    id: Item['id'],
    ownerId: Hero['id'],
  ): Promise<void> {
    await this.prisma.item.update({
      where: { id },
      data: { ownerId },
    });
  }
}
