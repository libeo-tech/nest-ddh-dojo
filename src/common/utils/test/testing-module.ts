import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
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
    ],
  });
};
