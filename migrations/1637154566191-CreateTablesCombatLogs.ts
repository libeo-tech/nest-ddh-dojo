import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesCombatLogs1637154566191 implements MigrationInterface {
  name = 'CreateTablesCombatLogs1637154566191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."pve_log_outcome_enum" AS ENUM('WIN', 'LOSS', 'DRAW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "pve_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', "heroId" uuid NOT NULL, "dragonId" uuid NOT NULL, "numberOfRounds" bigint NOT NULL DEFAULT '0', "outcome" "public"."pve_log_outcome_enum" NOT NULL DEFAULT 'DRAW', CONSTRAINT "PK_bb06eee49372bccc0e80cdc762c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."pvp_log_outcome_enum" AS ENUM('WIN', 'LOSS', 'DRAW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "pvp_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', "attackerId" uuid NOT NULL, "defenderId" uuid NOT NULL, "numberOfRounds" bigint NOT NULL DEFAULT '0', "outcome" "public"."pvp_log_outcome_enum" NOT NULL DEFAULT 'DRAW', CONSTRAINT "PK_21475004db4a6cdb8e873859c1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pve_log" ADD CONSTRAINT "FK_9fbe3ba5b3c07061f8a22cb906d" FOREIGN KEY ("heroId") REFERENCES "hero"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pve_log" ADD CONSTRAINT "FK_bbcbf059672bbb3aee4f45a049a" FOREIGN KEY ("dragonId") REFERENCES "dragon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pvp_log" ADD CONSTRAINT "FK_767d68b2142f4e9e109154c14bf" FOREIGN KEY ("attackerId") REFERENCES "hero"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pvp_log" ADD CONSTRAINT "FK_4bb3e1eea91e6c0769b509cc382" FOREIGN KEY ("defenderId") REFERENCES "hero"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pvp_log" DROP CONSTRAINT "FK_4bb3e1eea91e6c0769b509cc382"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pvp_log" DROP CONSTRAINT "FK_767d68b2142f4e9e109154c14bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pve_log" DROP CONSTRAINT "FK_bbcbf059672bbb3aee4f45a049a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pve_log" DROP CONSTRAINT "FK_9fbe3ba5b3c07061f8a22cb906d"`,
    );
    await queryRunner.query(`DROP TABLE "pvp_log"`);
    await queryRunner.query(`DROP TYPE "public"."pvp_log_outcome_enum"`);
    await queryRunner.query(`DROP TABLE "pve_log"`);
    await queryRunner.query(`DROP TYPE "public"."pve_log_outcome_enum"`);
  }
}
