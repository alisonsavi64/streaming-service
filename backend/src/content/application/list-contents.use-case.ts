import { ContentRepository } from '../domain/content.repository';

export class ListContentsUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
  ) { }

  async execute(search?: string) {
    const contents = search
      ? await this.contentRepository.search(search)
      : await this.contentRepository.findAll();
    return contents.map(content => ({
      id: content.id,
      title: content.title,
      description: content.description,
      thumbnailUrl: content.thumbnailUrl
        ? `${process.env.THUMBNAIL_BASE_URL}${content.thumbnailUrl}`
        : null,
      userId: content.userId
    }));
  }
}
