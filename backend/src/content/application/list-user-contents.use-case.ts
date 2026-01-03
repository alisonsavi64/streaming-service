import { ContentRepository } from '../domain/content.repository';

export class ListUserContentsUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
  ) { }

  async execute(id: string) {
    const contents = await this.contentRepository.findAllByUserId(id);
    return contents.map(content => ({
      id: content.id,
      title: content.title,
      description: content.description,
      thumbnailUrl: content.thumbnailUrl
        ? `${process.env.THUMBNAIL_BASE_URL}${content.thumbnailUrl}`
        : null,
      userId: content.userId,
      status: content.status
    }));
  }
}
