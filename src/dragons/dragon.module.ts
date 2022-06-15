import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DragonApplications } from './core/application/dragon.application';
import { DragonInfrastructure } from './infrastructure/dragon.infrastructure';
import { DragonInterface } from './interface/dragon.interface';

@Module({
  imports: [CqrsModule],
  providers: [
    ...DragonInterface.resolvers,
    ...DragonInfrastructure.providers,
    ...DragonApplications,
    ...DragonInterface.presenters,
  ],
  controllers: [...DragonInterface.controllers],
  exports: [...DragonInterface.presenters],
})
export class DragonModule {}
