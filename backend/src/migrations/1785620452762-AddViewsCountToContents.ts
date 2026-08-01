import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViewsCountToContents1785620452762 implements MigrationInterface {
    name = 'AddViewsCountToContents1785620452762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" ADD "viewsCount" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "viewsCount"`);
    }

}
