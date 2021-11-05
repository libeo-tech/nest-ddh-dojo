import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Hero } from '../src/heroes/infrastructure/typeorm/hero.orm-entity';
import { Dragon } from '../src/dragons/infrastructure/typeorm/dragon.orm-entity';
import { Item } from '../src/items/infrastructure/typeorm/item.orm-entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  const heroName = 'Batman';
  let hero: Hero;
  let dragon: Dragon;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    connection = await moduleFixture.get(Connection);
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await connection.synchronize(true);
    await app.close();
  });

  it('should create a new hero', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
        createHero(name: "${heroName}")
      }`,
      })
      .expect(200);

    expect(body.data.createHero).toBeTruthy();
    hero = await connection.manager.findOne(Hero, { name: heroName });
    expect(hero).toBeDefined();
  });

  it('should generate a new random dragon', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          generateRandomDragon
      }`,
      })
      .expect(200);

    expect(body.data.generateRandomDragon).toBeTruthy();
    const dragons = await connection.manager.find(Dragon);
    expect(dragons).toHaveLength(1);
    [dragon] = dragons;
  });

  it('should have hero slay a dragon and gain xp and loot', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          slayDragon(heroId: "${hero.id}", dragonId: "${dragon.id}")
      }`,
      })
      .expect(200);

    expect(body.data.slayDragon).toBeTruthy();
    const dragons = await connection.manager.find(Dragon);
    expect(dragons).toHaveLength(0);

    await new Promise((resolve) => setTimeout(resolve, 10));

    hero = await connection.manager.findOne(Hero, { name: heroName });
    expect(+hero.xp).toBeGreaterThan(0);
    const items = await connection.manager.find(Item, { ownerId: hero.id });
    expect(items).toHaveLength(1);
  });
});
