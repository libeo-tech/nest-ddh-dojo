import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DragonApplications } from './core/application/dragon.application';
import { DragonInfrastructure } from './infrastructure/dragon.infrastructure';
import { DragonInterface } from './interface/dragon.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([...DragonInfrastructure.repositories]),
    CqrsModule,
  ],
  providers: [
    ...DragonInterface.resolvers,
    ...DragonInfrastructure.providers,
    ...DragonApplications,
  ],
  controllers: [...DragonInterface.controllers],
  exports: [],
})
export class DragonModule {}
