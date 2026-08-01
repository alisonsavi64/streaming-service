import { ContentRepository } from '../domain/content.repository';
import { ContentLikeRepository } from '../domain/content-like.repository';
import { ContentNotFoundError } from '../domain/content.errors';

export class UnlikeContentUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly likeRepository: ContentLikeRepository,
  ) {}

  async execute(contentId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const content = await this.contentRepository.findById(contentId);
    if (!content) {
      throw new ContentNotFoundError(contentId);
    }

    await this.likeRepository.unlike(contentId, userId);
    const likesCount = await this.likeRepository.countByContentId(contentId);

    return { liked: false, likesCount };
  }
}
