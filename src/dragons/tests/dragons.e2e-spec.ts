import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Dragon } from '../infrastructure/typeorm/dragon.orm-entity';
import { createTestModule } from '../../common/utils/test/testing-module';
import { DragonModule } from '../dragon.module';

describe('Dragons module (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture = await createTestModule([DragonModule]).compile();

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

  it('should generate a random dragon', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          generateRandomDragon
        }`,
      })
      .expect(200);

    expect(body.data.generateRandomDragon).toBeTruthy();

    const allDragons = await connection.manager.find(Dragon);
    expect(allDragons).toHaveLength(1);
  });

  it('should get all the dragons', async () => {
    const dragons = [
      { level: 1, currentHp: 5 },
      { level: 2, currentHp: 10 },
      { level: 3, currentHp: 15 },
    ];
    await Promise.all(
      connection.manager.create(Dragon, dragons).map((dragon) => dragon.save()),
    );

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query {
          getAllDragons {
            level
            currentHp
          }
        }`,
      })
      .expect(200);

    dragons.forEach((dragon) =>
      expect(body.data.getAllDragons).toContainEqual(dragon),
    );
  });
});
