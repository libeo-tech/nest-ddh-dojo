import { DataSource } from 'typeorm';
import { connectionOptions } from './database-connection';

export const AppDataSource = new DataSource({
  ...connectionOptions,
  migrations: [`${__dirname}/../migrations/*.ts`],
});
