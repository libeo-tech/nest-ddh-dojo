import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterCombatLogOutComeEnum1653391879529 implements MigrationInterface {
    name = 'AlterCombatLogOutComeEnum1653391879529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pve_log_outcome_enum" RENAME TO "pve_log_outcome_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pve_log_outcome_enum" AS ENUM('WIN', 'LOSS', 'DRAW', 'ERROR')`);
        await queryRunner.query(`ALTER TABLE "pve_log" ALTER COLUMN "outcome" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pve_log" ALTER COLUMN "outcome" TYPE "public"."pve_log_outcome_enum" USING "outcome"::"text"::"public"."pve_log_outcome_enum"`);
        await queryRunner.query(`ALTER TABLE "pve_log" ALTER COLUMN "outcome" SET DEFAULT 'DRAW'`);
        await queryRunner.query(`DROP TYPE "public"."pve_log_outcome_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."pvp_log_outcome_enum" RENAME TO "pvp_log_outcome_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pvp_log_outcome_enum" AS ENUM('WIN', 'LOSS', 'DRAW', 'ERROR')`);
        await queryRunner.query(`ALTER TABLE "pvp_log" ALTER COLUMN "outcome" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pvp_log" ALTER COLUMN "outcome" TYPE "public"."pvp_log_outcome_enum" USING "outcome"::"text"::"public"."pvp_log_outcome_enum"`);
        await queryRunner.query(`ALTER TABLE "pvp_log" ALTER COLUMN "outcome" SET DEFAULT 'DRAW'`);
        await queryRunner.query(`DROP TYPE "public"."pvp_log_outcome_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pvp_log_outcome_enum_old" AS ENUM('WIN', 'LOSS', 'DRAW')`);
        await queryRunner.query(`ALTER TABLE "pvp_log" ALTER COLUMN "outcome" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pvp_log" ALTER COLUMN "outcome" TYPE "public"."pvp_log_outcome_enum_old" USING "outcome"::"text"::"public"."pvp_log_outcome_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pvp_log" ALTER COLUMN "outcome" SET DEFAULT 'DRAW'`);
        await queryRunner.query(`DROP TYPE "public"."pvp_log_outcome_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pvp_log_outcome_enum_old" RENAME TO "pvp_log_outcome_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."pve_log_outcome_enum_old" AS ENUM('WIN', 'LOSS', 'DRAW')`);
        await queryRunner.query(`ALTER TABLE "pve_log" ALTER COLUMN "outcome" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pve_log" ALTER COLUMN "outcome" TYPE "public"."pve_log_outcome_enum_old" USING "outcome"::"text"::"public"."pve_log_outcome_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pve_log" ALTER COLUMN "outcome" SET DEFAULT 'DRAW'`);
        await queryRunner.query(`DROP TYPE "public"."pve_log_outcome_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pve_log_outcome_enum_old" RENAME TO "pve_log_outcome_enum"`);
    }

}
