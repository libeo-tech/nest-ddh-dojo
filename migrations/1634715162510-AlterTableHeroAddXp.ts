import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterTableHeroAddXp1634715162510 implements MigrationInterface {
    name = 'AlterTableHeroAddXp1634715162510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hero" ADD "xp" bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hero" DROP COLUMN "xp"`);
    }

}
