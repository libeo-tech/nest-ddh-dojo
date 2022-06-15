import { PrismaService } from '../../prisma/prisma.service';
import { Item, ItemWithOwner } from '../core/domain/item.entity';
import { ItemAdapter } from './prisma/item.adapter';

export const ItemInfrastructure = {
  providers: [
    PrismaService,
    { provide: Item, useClass: ItemAdapter },
    { provide: ItemWithOwner, useClass: ItemAdapter },
  ],
};
