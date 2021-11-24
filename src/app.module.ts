import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatModule } from './combat/combat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [__dirname + '/../**/*.orm-entity.{js,ts}'],
      database: 'dojo',
    }),
    CombatModule,
  ],
})
export class AppModule {}
