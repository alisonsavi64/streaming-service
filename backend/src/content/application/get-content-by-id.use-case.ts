import { ContentRepository } from '../domain/content.repository';
import { ContentNotFoundError } from '../domain/content.errors';
import { Content } from '../domain/content.entity';

export class GetContentByIdUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
  ) { }

  async execute(params: { id: string }): Promise<Content> {
    const content = await this.contentRepository.findById(params.id);
    if (!content) {
      throw new ContentNotFoundError(params.id);
    }
    content.setThumbnail(`${process.env.THUMBNAIL_BASE_URL}${content.thumbnailUrl}`);
    return content;
  }
}
