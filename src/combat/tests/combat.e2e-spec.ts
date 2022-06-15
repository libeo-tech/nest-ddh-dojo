import * as request from 'supertest';
import { CombatModule } from '../combat.module';
import { INestApplication } from '@nestjs/common';
import { EventBus, ofType } from '@nestjs/cqrs';
import { CombatEndedEvent } from '../core/application/sagas/combat.event';
import { firstValueFrom } from 'rxjs';
import { Outcome } from '../core/domain/combat-log/combat-log.entity';
import { createTestModule } from '../../common/utils/test/testing-module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Combat module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let eventBus: EventBus;
  const heroName = 'Batman';

  beforeAll(async () => {
    const moduleFixture = await createTestModule([CombatModule]).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = await moduleFixture.get(PrismaService);

    eventBus = moduleFixture.get(EventBus);
  });

  beforeEach(async () => {
    await prisma.truncate();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should have a lvl 1 hero win against a level 1 dragon', async () => {
    const hero = await prisma.hero.create({
      data: {
        name: heroName,
        level: 1,
        currentHp: 10,
      },
    });
    const dragon = await prisma.dragon.create({
      data: {
        level: 1,
        currentHp: 5,
      },
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

    const losingDragon = await prisma.dragon.findFirst({
      where: { id: dragon.id },
    });
    expect(+losingDragon.currentHp).toBeLessThanOrEqual(0);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const winningHero = await prisma.hero.findFirst({ where: { id: hero.id } });
    expect(+winningHero.currentHp).toBeGreaterThan(0);
    expect(+winningHero.xp).toBeGreaterThan(0);

    const loot = await prisma.item.findMany({
      where: { ownerId: hero.id },
    });
    expect(loot).toBeDefined();
    expect(loot).toHaveLength(1);
  });

  it('should have a lvl 1 hero lose against a level 9 dragon', async () => {
    const hero = await prisma.hero.create({
      data: {
        name: heroName,
        level: 1,
        currentHp: 10,
      },
    });
    const dragon = await prisma.dragon.create({
      data: {
        level: 9,
        currentHp: 45,
      },
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

    const winningDragon = await prisma.dragon.findFirst({
      where: { id: dragon.id },
    });
    expect(+winningDragon.currentHp).toBeGreaterThan(0);

    const losingHero = await prisma.hero.findFirst({ where: { id: hero.id } });
    expect(+losingHero.currentHp).toBeLessThanOrEqual(0);
    expect(+losingHero.xp).toStrictEqual(0);
  });
});
