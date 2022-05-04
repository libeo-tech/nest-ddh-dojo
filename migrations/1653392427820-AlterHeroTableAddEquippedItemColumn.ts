import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterHeroTableAddEquippedItemColumn1653392427820 implements MigrationInterface {
    name = 'AlterHeroTableAddEquippedItemColumn1653392427820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hero" ADD "equippedItem" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hero" DROP COLUMN "equippedItem"`);
    }

}
