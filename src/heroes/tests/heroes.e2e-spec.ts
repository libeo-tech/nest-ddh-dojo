import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestModule } from '../../common/utils/test/testing-module';
import { HeroModule } from '../hero.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Heroes module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const heroName = 'Superman';

  beforeAll(async () => {
    const moduleFixture = await createTestModule([HeroModule]).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = await moduleFixture.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.truncate();
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

    const hero = await prisma.hero.findFirst({
      where: {
        name: heroName,
      },
    });
    expect(hero).toBeDefined();
  });

  it('should get a hero', async () => {
    const hero = { name: heroName, level: 1, currentHp: 5 };
    const { id: heroId } = await prisma.hero.create({ data: hero });

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
