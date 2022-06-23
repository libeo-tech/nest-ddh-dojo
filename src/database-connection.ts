import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const connectionOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'dojo',
  entities: [`${__dirname}/**/*.orm-entity.ts`],
  subscribers: [],
};
