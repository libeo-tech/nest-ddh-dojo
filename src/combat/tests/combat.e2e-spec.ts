import * as request from 'supertest';
import { CombatModule } from '../combat.module';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Hero } from '../../heroes/infrastructure/typeorm/hero.orm-entity';
import { Dragon } from '../../dragons/infrastructure/typeorm/dragon.orm-entity';
import { EventBus, ofType } from '@nestjs/cqrs';
import { CombatEndedEvent } from '../core/application/sagas/combat.event';
import { first } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Outcome } from '../core/domain/combat-log/combat-log.entity';
import { createTestModule } from '../../common/utils/test/testing-module';

describe('Combat module (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let eventBus: EventBus;
  const heroName = 'Batman';

  beforeAll(async () => {
    const moduleFixture = await createTestModule([CombatModule]).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    connection = await moduleFixture.get(Connection);
    await connection.synchronize(true);

    eventBus = moduleFixture.get(EventBus);
  });

  afterAll(async () => {
    await connection.synchronize(true);
    await app.close();
  });

  it('should have a lvl 1 hero win against a level 1 dragon', async () => {
    const hero = await connection.manager
      .create(Hero, { name: heroName, level: 1, currentHp: 10 })
      .save();
    const dragon = await connection.manager
      .create(Dragon, { level: 1, currentHp: 5 })
      .save();

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
      eventBus.pipe(ofType(CombatEndedEvent), first()),
    );
    expect(payload.outcome).toBe(Outcome.WIN);

    const losingDragon = await connection.manager.findOne(Dragon, {
      id: dragon.id,
    });
    expect(+losingDragon.currentHp).toBeLessThanOrEqual(0);

    const winningHero = await connection.manager.findOne(Hero, {
      id: hero.id,
    });
    expect(+winningHero.currentHp).toBeGreaterThan(0);
    expect(+winningHero.xp).toBeGreaterThan(0);
  });

  it('should have a lvl 1 hero lose against a level 9 dragon', async () => {
    const hero = await connection.manager
      .create(Hero, { name: heroName, level: 1, currentHp: 10 })
      .save();
    const dragon = await connection.manager
      .create(Dragon, { level: 9, currentHp: 45 })
      .save();

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
      eventBus.pipe(ofType(CombatEndedEvent), first()),
    );
    expect(payload.outcome).toBe(Outcome.LOSS);

    const winningDragon = await connection.manager.findOne(Dragon, {
      id: dragon.id,
    });
    expect(+winningDragon.currentHp).toBeGreaterThan(0);

    const losingHero = await connection.manager.findOne(Hero, {
      id: hero.id,
    });
    expect(+losingHero.currentHp).toBeLessThanOrEqual(0);
    expect(+losingHero.xp).toStrictEqual(0);
  });
});
