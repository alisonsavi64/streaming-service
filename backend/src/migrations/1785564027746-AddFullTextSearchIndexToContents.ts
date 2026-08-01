import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullTextSearchIndexToContents1785564027746 implements MigrationInterface {
  name = 'AddFullTextSearchIndexToContents1785564027746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_contents_search_vector" ON "contents" USING GIN (to_tsvector('english', coalesce("title", '') || ' ' || coalesce("description", '')))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_contents_search_vector"`);
  }
}
