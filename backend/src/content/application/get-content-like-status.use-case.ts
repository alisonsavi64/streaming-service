import { ContentLikeRepository } from '../domain/content-like.repository';

export class GetContentLikeStatusUseCase {
  constructor(private readonly likeRepository: ContentLikeRepository) {}

  async execute(contentId: string, userId: string): Promise<{ liked: boolean }> {
    const liked = await this.likeRepository.isLikedByUser(contentId, userId);
    return { liked };
  }
}
