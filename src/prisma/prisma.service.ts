import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async truncate() {
    if (process.env.NODE_ENV === 'test') {
      const records = await this.$queryRawUnsafe<
        Array<unknown>
      >(`SELECT tablename
                                                          FROM pg_tables
                                                          WHERE schemaname = 'public'`);
      records.forEach((record) => this.truncateTable(record['tablename']));
    }
  }

  async truncateTable(tablename) {
    if (process.env.NODE_ENV === 'test') {
      if (tablename === undefined || tablename === '_prisma_migrations') {
        return;
      }
      try {
        await this.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
}
