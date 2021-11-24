import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

export const createTestModule = (modules: any[]) => {
  return Test.createTestingModule({
    imports: [
      ...modules,
      GraphQLModule.forRoot({
        typePaths: ['./**/*.graphql'],
      }),
      TypeOrmModule.forRoot({
        type: 'postgres',
        entities: [__dirname + '/../../../**/*.orm-entity.{js,ts}'],
        database: 'dojo-test',
        username: 'postgres',
        password: 'postgres',
      }),
    ],
  });
};
