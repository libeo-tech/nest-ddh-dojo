import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

export const createTestModule = (
  modules: ModuleMetadata['imports'],
): TestingModuleBuilder => {
  return Test.createTestingModule({
    imports: [
      ...modules,
      ConfigModule.forRoot(),
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        typePaths: ['./**/*.graphql'],
      }),
      TypeOrmModule.forRoot({
        type: 'postgres',
        entities: [__dirname + '/../../../**/*.orm-entity.{js,ts}'],
        database: `${process.env.POSTGRES_DB}-test`,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      }),
    ],
  });
};
