import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatModule } from './combat/combat.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { connectionOptions } from './database-connection';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    TypeOrmModule.forRoot({
      ...connectionOptions,
      autoLoadEntities: true,
    }),
    CombatModule,
  ],
})
export class AppModule {}
