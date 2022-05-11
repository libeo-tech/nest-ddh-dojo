import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

export const createTestModule = (modules: any[]) => {
  return Test.createTestingModule({
    imports: [
      ...modules,
      ConfigModule.forRoot(),
      GraphQLModule.forRoot({
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
