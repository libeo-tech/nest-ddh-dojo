import * as request from 'supertest';
import { CombatModule } from '../combat.module';
import { INestApplication } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { Hero } from '../../heroes/infrastructure/typeorm/hero.orm-entity';
import { Dragon } from '../../dragons/infrastructure/typeorm/dragon.orm-entity';
import { EventBus, ofType } from '@nestjs/cqrs';
import { CombatEndedEvent } from '../core/application/sagas/combat.event';
import { firstValueFrom } from 'rxjs';
import { Outcome } from '../core/domain/combat-log/combat-log.entity';
import { createTestModule } from '../../common/utils/test/testing-module';
import { Item } from '../../items/infrastructure/typeorm/item.orm-entity';

describe('Combat module (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let eventBus: EventBus;
  const heroName = 'Batman';

  beforeAll(async () => {
    const moduleFixture = await createTestModule([CombatModule]).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    entityManager = await moduleFixture.get(EntityManager);

    eventBus = moduleFixture.get(EventBus);
  });

  beforeEach(async () => {
    await entityManager.connection.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should have a lvl 1 hero win against a level 1 dragon', async () => {
    const hero = await entityManager.save(Hero, {
      name: heroName,
      level: 1,
      currentHp: 10,
    });
    const dragon = await entityManager.save(Dragon, {
      level: 1,
      currentHp: 5,
    });

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          attackDragon(heroId: "${hero.id}", dragonId: "${dragon.id}")
        }`,
      })
      .expect(200);

    expect(body.data.attackDragon).toBeTruthy();
    const { payload } = await firstValueFrom(
      eventBus.pipe(ofType(CombatEndedEvent)),
    );
    expect(payload.outcome).toBe(Outcome.WIN);

    const losingDragon = await entityManager.findOneById(Dragon, dragon.id);
    expect(+losingDragon.currentHp).toBeLessThanOrEqual(0);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const winningHero = await entityManager.findOneById(Hero, hero.id);
    expect(+winningHero.currentHp).toBeGreaterThan(0);
    expect(+winningHero.xp).toBeGreaterThan(0);

    const loot = await entityManager.find(Item, {
      where: { ownerId: In([hero.id]) },
    });
    expect(loot).toBeDefined();
  });

  it('should have a lvl 1 hero lose against a level 9 dragon', async () => {
    const hero = await entityManager.save(Hero, {
      name: heroName,
      level: 1,
      currentHp: 10,
    });
    const dragon = await entityManager.save(Dragon, {
      level: 9,
      currentHp: 45,
    });

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          attackDragon(heroId: "${hero.id}", dragonId: "${dragon.id}")
        }`,
      })
      .expect(200);

    expect(body.data.attackDragon).toBeTruthy();
    const { payload } = await firstValueFrom(
      eventBus.pipe(ofType(CombatEndedEvent)),
    );
    expect(payload.outcome).toBe(Outcome.LOSS);

    const winningDragon = await entityManager.findOneById(Dragon, dragon.id);
    expect(+winningDragon.currentHp).toBeGreaterThan(0);

    const losingHero = await entityManager.findOneById(Hero, hero.id);
    expect(+losingHero.currentHp).toBeLessThanOrEqual(0);
    expect(+losingHero.xp).toStrictEqual(0);
  });
});
