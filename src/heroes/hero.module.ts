import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ItemModule } from '../items/item.module';
import { HeroApplications } from './core/application/hero.application';
import { HeroInfrastructure } from './infrastructure/hero.infrastructure';
import { HeroInterface } from './interface/hero.interface';

@Module({
  imports: [CqrsModule, ItemModule],
  providers: [
    ...HeroInterface.resolvers,
    ...HeroInfrastructure.providers,
    ...HeroApplications,
    ...HeroInterface.presenters,
  ],
  controllers: [...HeroInterface.controllers],
  exports: [...HeroInterface.presenters],
})
export class HeroModule {}
