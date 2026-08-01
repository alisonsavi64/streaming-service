import { ContentRepository } from '../domain/content.repository';
import { ContentNotFoundError } from '../domain/content.errors';

export class IncrementContentViewsUseCase {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(id: string): Promise<void> {
    const content = await this.contentRepository.findById(id);
    if (!content) {
      throw new ContentNotFoundError(id);
    }

    await this.contentRepository.incrementViews(id);
  }
}
