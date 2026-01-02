import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContentsTable1767285516020 implements MigrationInterface {
    name = 'CreateContentsTable1767285516020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "contents_status_enum" AS ENUM ('UPLOADED', 'PROCESSING', 'PROCESSED', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "contents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "status" "public"."contents_status_enum" NOT NULL DEFAULT 'UPLOADED', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "processedAt" TIMESTAMP, "thumbnailUrl" character varying, "userId" uuid NOT NULL, CONSTRAINT "PK_b7c504072e537532d7080c54fac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contents" ADD CONSTRAINT "FK_191675b22eb3ee27cda4aeb0f5f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" DROP CONSTRAINT "FK_191675b22eb3ee27cda4aeb0f5f"`);
        await queryRunner.query(`DROP TABLE "contents"`);
        await queryRunner.query(`DROP TYPE "contents_status_enum"`);
    }

}
