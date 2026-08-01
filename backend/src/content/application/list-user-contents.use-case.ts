import { ContentRepository } from '../domain/content.repository';
import { ContentLikeRepository } from '../domain/content-like.repository';

export class ListUserContentsUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly likeRepository: ContentLikeRepository,
  ) {}

  async execute(id: string) {
    const contents = await this.contentRepository.findAllByUserId(id);

    const likeCounts = await this.likeRepository.countByContentIds(
      contents.map((content) => content.id),
    );

    return contents.map((content) => ({
      id: content.id,
      title: content.title,
      description: content.description,
      thumbnailUrl: content.thumbnailUrl
        ? `${process.env.THUMBNAIL_BASE_URL}${content.thumbnailUrl}`
        : null,
      userId: content.userId,
      status: content.status,
      genre: content.genre,
      viewsCount: content.viewsCount,
      createdAt: content.createdAt,
      likesCount: likeCounts[content.id] ?? 0,
    }));
  }
}
