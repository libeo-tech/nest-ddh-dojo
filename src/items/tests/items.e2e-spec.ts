import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestModule } from '../../common/utils/test/testing-module';
import { ItemModule } from '../item.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Items module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await createTestModule([ItemModule]).compile();

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

  it('should get all the items', async () => {
    const items = [
      { name: 'Orb of Zot' },
      { name: 'Excalibur' },
      { name: 'BFG-9000' },
    ];
    await prisma.item.createMany({ data: items });

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
