import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableHeroNewColumnCurrentHp1636984682075
  implements MigrationInterface
{
  name = 'AlterTableHeroNewColumnCurrentHp1636984682075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hero" ADD "currentHp" bigint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "dragon" ADD "currentHp" bigint NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dragon" DROP COLUMN "currentHp"`);
    await queryRunner.query(`ALTER TABLE "hero" DROP COLUMN "currentHp"`);
  }
}
