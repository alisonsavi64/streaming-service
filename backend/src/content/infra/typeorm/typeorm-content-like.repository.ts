import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentLikeRepository } from '../../domain/content-like.repository';
import { ContentLikeOrmEntity } from './content-like.orm-entity';

export class TypeOrmContentLikeRepository implements ContentLikeRepository {
  constructor(
    @InjectRepository(ContentLikeOrmEntity)
    private readonly repository: Repository<ContentLikeOrmEntity>,
  ) {}

  async like(contentId: string, userId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into(ContentLikeOrmEntity)
      .values({ contentId, userId })
      .orIgnore()
      .execute();
  }

  async unlike(contentId: string, userId: string): Promise<void> {
    await this.repository.delete({ contentId, userId });
  }

  async isLikedByUser(contentId: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { contentId, userId } });
    return count > 0;
  }

  async countByContentId(contentId: string): Promise<number> {
    return this.repository.count({ where: { contentId } });
  }

  async countByContentIds(contentIds: string[]): Promise<Record<string, number>> {
    if (contentIds.length === 0) return {};

    const rows = await this.repository
      .createQueryBuilder('like')
      .select('like.contentId', 'contentId')
      .addSelect('COUNT(*)', 'count')
      .where('like.contentId IN (:...contentIds)', { contentIds })
      .groupBy('like.contentId')
      .getRawMany<{ contentId: string; count: string }>();

    return rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.contentId] = Number(row.count);
      return acc;
    }, {});
  }
}
