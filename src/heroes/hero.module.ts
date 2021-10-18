import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from '../items/item.module';
import { HeroApplications } from './core/application/hero.application';
import { HeroInfrastructure } from './infrastructure/hero.infrastructure';
import { HeroInterface } from './interface/hero.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([...HeroInfrastructure.repositories]),
    CqrsModule,
    ItemModule,
  ],
  providers: [
    ...HeroInterface.resolvers,
    ...HeroInfrastructure.providers,
    ...HeroApplications,
  ],
  controllers: [...HeroInterface.controllers],
  exports: [],
})
export class HeroModule {}
