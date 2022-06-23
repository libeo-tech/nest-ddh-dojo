import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Item } from '../infrastructure/typeorm/item.orm-entity';
import { createTestModule } from '../../common/utils/test/testing-module';
import { ItemModule } from '../item.module';

describe('Items module (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const moduleFixture = await createTestModule([ItemModule]).compile();
    app = await moduleFixture.createNestApplication().init();

    entityManager = moduleFixture.get(EntityManager);
  });

  beforeEach(async () => {
    await entityManager.connection.synchronize(true);
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
      items.map((item) => entityManager.save(Item, { ...item })),
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

    expect(body.data.getAllItems).toEqual(expect.arrayContaining(items));
  });
});
