import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DragonModule } from './dragons/dragon.module';
import { HeroModule } from './heroes/hero.module';
import { ItemModule } from './items/item.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [__dirname + '/../**/*.orm-entity.{js,ts}'],
    }),
    HeroModule,
    DragonModule,
    ItemModule,
  ],
})
export class AppModule {}
