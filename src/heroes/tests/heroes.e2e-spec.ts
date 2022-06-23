import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Hero } from '../infrastructure/typeorm/hero.orm-entity';
import { createTestModule } from '../../common/utils/test/testing-module';
import { HeroModule } from '../hero.module';
import { Item } from '../../items/infrastructure/typeorm/item.orm-entity';

describe('Heroes module (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  const heroName = 'Superman';

  beforeAll(async () => {
    const moduleFixture = await createTestModule([HeroModule]).compile();
    app = await moduleFixture.createNestApplication().init();

    entityManager = moduleFixture.get(EntityManager);
  });

  beforeEach(async () => {
    await entityManager.connection.synchronize();
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

    const hero = await entityManager.findOneBy(Hero, {
      name: heroName,
    });
    expect(hero).toBeDefined();
  });

  it('should get a hero', async () => {
    const hero = { name: heroName, level: 1, currentHp: 5 };
    const { id: heroId } = await entityManager.save(Hero, { ...hero });

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

  it('should equip an item', async () => {
    const heroData = { name: heroName, level: 1, currentHp: 5 };
    const { id: heroId } = await entityManager.save(Hero, heroData);
    const { id: itemId } = await entityManager.save(Item, {
      name: 'Excalibur',
      ownerId: heroId,
    });

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          equipItem(heroId: "${heroId}", itemId: "${itemId}")
        }`,
      })
      .expect(200);

    expect(body.data.equipItem).toBeTruthy();
    const hero = await entityManager.findOneById(Hero, heroId);
    expect(hero.equippedItem).toStrictEqual(itemId);
  });
});
