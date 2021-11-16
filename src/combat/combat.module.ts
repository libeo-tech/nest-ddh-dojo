import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DragonModule } from '../dragons/dragon.module';
import { HeroModule } from '../heroes/hero.module';
import { ItemModule } from '../items/item.module';
import { CombatApplications } from './core/application/combat.application';
import { CombatInfrastructure } from './infrastructure/combat.infrastructure';
import { CombatInterface } from './interface/combat.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([...CombatInfrastructure.repositories]),
    CqrsModule,
    HeroModule,
    DragonModule,
    ItemModule,
  ],
  providers: [
    ...CombatInterface.resolvers,
    ...CombatInfrastructure.providers,
    ...CombatApplications,
  ],
  controllers: [...CombatInterface.controllers],
  exports: [],
})
export class CombatModule {}
