import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContentLikesTable1785621496881 implements MigrationInterface {
    name = 'CreateContentLikesTable1785621496881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "content_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contentId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_content_likes_content_user" UNIQUE ("contentId", "userId"), CONSTRAINT "PK_content_likes_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "content_likes" ADD CONSTRAINT "FK_content_likes_content" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content_likes" ADD CONSTRAINT "FK_content_likes_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_likes" DROP CONSTRAINT "FK_content_likes_user"`);
        await queryRunner.query(`ALTER TABLE "content_likes" DROP CONSTRAINT "FK_content_likes_content"`);
        await queryRunner.query(`DROP TABLE "content_likes"`);
    }

}
