import { ContentRepository } from '../domain/content.repository';
import { ContentLikeRepository } from '../domain/content-like.repository';
import { ContentNotFoundError } from '../domain/content.errors';

export class GetContentByIdUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly likeRepository: ContentLikeRepository,
  ) {}

  async execute(params: { id: string }) {
    const content = await this.contentRepository.findById(params.id);
    if (!content) {
      throw new ContentNotFoundError(params.id);
    }
    content.setThumbnail(`${process.env.THUMBNAIL_BASE_URL}${content.thumbnailUrl}`);

    const likesCount = await this.likeRepository.countByContentId(params.id);

    return {
      id: content.id,
      title: content.title,
      description: content.description,
      status: content.status,
      userId: content.userId,
      createdAt: content.createdAt,
      processedAt: content.processedAt,
      thumbnailUrl: content.thumbnailUrl,
      genre: content.genre,
      viewsCount: content.viewsCount,
      likesCount,
    };
  }
}
