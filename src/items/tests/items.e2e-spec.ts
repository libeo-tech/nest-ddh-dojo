import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Item } from '../infrastructure/typeorm/item.orm-entity';
import { createTestModule } from '../../common/utils/test/testing-module';
import { ItemModule } from '../item.module';

describe('Items module (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture = await createTestModule([ItemModule]).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    connection = await moduleFixture.get(Connection);
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get all the items', async () => {
    const items = [
      { name: 'Orb of Zot' },
      { name: 'Excalibur' },
      { name: 'BFG-9000' },
    ];
    await Promise.all(
      connection.manager.create(Item, items).map((item) => item.save()),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query {
          getAllItems {
            name
          }
        }`,
      })
      .expect(200);

    items.forEach((item) => expect(body.data.getAllItems).toContainEqual(item));
  });
});
