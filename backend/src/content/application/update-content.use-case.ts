import type { ContentRepository } from '../domain/content.repository';
import { ContentNotFoundError } from '../domain/content.errors';

export class UpdateContentUseCase {
  constructor(private readonly contentRepository: ContentRepository) {}

  async execute(id: string, userId: string, data: { title?: string; description?: string }) {
    const content = await this.contentRepository.findById(id);
    if (!content) {
      throw new ContentNotFoundError(`Content with id ${id} not found`);
    }
    if (content.userId !== userId) {
      throw new Error('Unauthorized: You can only update your own content');
    }
    await this.contentRepository.update(id, data);
    return { message: 'Content updated successfully' };
  }
}
