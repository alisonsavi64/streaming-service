import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGenreToContents1785617748458 implements MigrationInterface {
  name = 'AddGenreToContents1785617748458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "contents_genre_enum" AS ENUM ('MUSIC', 'LIFESTYLE', 'GAMING', 'MOVIES', 'EDUCATION', 'TECH', 'SCIENCE', 'SPORTS', 'NEWS', 'HEALTH', 'TRAVEL', 'FOOD', 'ARTS', 'COMEDY', 'BEAUTY', 'CARS', 'PETS', 'PHOTOGRAPHY', 'BOOKS', 'MOTIVATION', 'FINANCE', 'PROGRAMMING')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "genre" "public"."contents_genre_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "genre"`);
    await queryRunner.query(`DROP TYPE "contents_genre_enum"`);
  }
}
