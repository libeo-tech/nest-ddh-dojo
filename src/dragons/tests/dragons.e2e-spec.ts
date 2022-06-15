import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestModule } from '../../common/utils/test/testing-module';
import { DragonModule } from '../dragon.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Dragons module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await createTestModule([DragonModule]).compile();

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

  it('should generate a new dragon', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          generateNewDragon
        }`,
      })
      .expect(200);

    expect(body.data.generateNewDragon).toBeTruthy();

    const allDragons = await prisma.dragon.findMany();
    expect(allDragons).toHaveLength(1);
  });

  it('should get all the dragons', async () => {
    const dragons = [
      { level: 1, currentHp: 5 },
      { level: 2, currentHp: 10 },
      { level: 3, currentHp: 15 },
    ];

    await prisma.dragon.createMany({ data: dragons });

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

    expect(body.data.getAllDragons).toEqual(expect.arrayContaining(dragons));
  });
});
