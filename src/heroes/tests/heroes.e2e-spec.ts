import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Hero } from '../infrastructure/typeorm/hero.orm-entity';
import { createTestModule } from '../../common/utils/test/testing-module';
import { HeroModule } from '../hero.module';

describe('Heroes module (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  const heroName = 'Superman';

  beforeAll(async () => {
    const moduleFixture = await createTestModule([HeroModule]).compile();

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

  it('should generate a random hero', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          createHero(name: "${heroName}")
        }`,
      })
      .expect(200);

    expect(body.data.createHero).toBeTruthy();

    const hero = await connection.manager.findOne(Hero, {
      name: heroName,
    });
    expect(hero).toBeDefined();
  });

  it('should get a hero', async () => {
    const hero = { name: heroName, level: 1, currentHp: 5 };
    const { id: heroId } = await connection.manager.create(Hero, hero).save();

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query {
          getHero(id: "${heroId}") {
            currentHp
            level
            name
          }
        }`,
      })
      .expect(200);

    expect(body.data.getHero).toMatchObject(hero);
  });
});
