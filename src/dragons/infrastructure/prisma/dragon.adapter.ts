import { Injectable } from '@nestjs/common';
import { BasePorts } from '../../../common/core/domain/base.ports';
import { PrismaService } from '../../../prisma/prisma.service';
import { Dragon } from '../../core/domain/dragon.entity';
import {
  mapDragonOrmEntityToDragonEntity,
  mapEntityPropertiesToOrmEntityProperties,
} from './dragon.orm-mapper';

@Injectable()
export class DragonAdapter implements BasePorts<Dragon> {
  constructor(private prisma: PrismaService) {}

  async getById(id: Dragon['id']): Promise<Dragon> {
    const dragon = await this.prisma.dragon.findFirst({ where: { id } });

    return mapDragonOrmEntityToDragonEntity(dragon);
  }

  async getAll(): Promise<Dragon[]> {
    const dragons = await this.prisma.dragon.findMany();

    return dragons.map(mapDragonOrmEntityToDragonEntity);
  }

  async create(properties: Partial<Dragon>): Promise<Dragon> {
    const dragon = await this.prisma.dragon.create({
      data: mapEntityPropertiesToOrmEntityProperties(properties),
    });

    return mapDragonOrmEntityToDragonEntity(dragon);
  }

  async update(
    entityId: Dragon['id'],
    properties: Partial<Dragon>,
  ): Promise<Dragon> {
    const dragon = await this.prisma.dragon.update({
      where: { id: entityId },
      data: mapEntityPropertiesToOrmEntityProperties(properties),
    });

    return mapDragonOrmEntityToDragonEntity(dragon);
  }

  async delete(id: Dragon['id']): Promise<void> {
    await this.prisma.dragon.delete({ where: { id } });
  }
}
