import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstDatabaseSetup1634306349165 implements MigrationInterface {
  name = 'FirstDatabaseSetup1634306349165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."dragon_color_enum" AS ENUM('red', 'green', 'blue', 'yellow', 'white', 'black')`,
    );
    await queryRunner.query(
      `CREATE TABLE "dragon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', "level" bigint NOT NULL DEFAULT '1', "color" "public"."dragon_color_enum" NOT NULL DEFAULT 'red', CONSTRAINT "PK_097761d2985fe54fda971ff9af8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', "name" character varying NOT NULL, "ownerId" uuid, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hero" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', "name" character varying NOT NULL, "level" bigint NOT NULL DEFAULT '1', CONSTRAINT "PK_313d51d6899322b85f2df99ccde" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_3b030ef7f2840a721547a3c492e" FOREIGN KEY ("ownerId") REFERENCES "hero"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_3b030ef7f2840a721547a3c492e"`,
    );
    await queryRunner.query(`DROP TABLE "hero"`);
    await queryRunner.query(`DROP TABLE "item"`);
    await queryRunner.query(`DROP TABLE "dragon"`);
    await queryRunner.query(`DROP TYPE "public"."dragon_color_enum"`);
  }
}
