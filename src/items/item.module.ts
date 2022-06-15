import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ItemApplications } from './core/application/item.application';
import { ItemInfrastructure } from './infrastructure/item.infrastructure';
import { ItemInterface } from './interface/item.interface';

@Module({
  imports: [CqrsModule],
  providers: [
    ...ItemInterface.resolvers,
    ...ItemInfrastructure.providers,
    ...ItemApplications,
    ItemInterface.presenter,
  ],
  controllers: [...ItemInterface.controllers],
  exports: [ItemInterface.presenter],
})
export class ItemModule {}
