import type { ContentRepository } from '../domain/content.repository';
import { ContentNotFoundError } from '../domain/content.errors';
import type { StoragePort } from '../domain/storage.port';
import type { EventBus } from 'src/shared/application/messaging/event-bus.port';

export class DeleteContentUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly storage: StoragePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(id: string, userId: string) {
    const content = await this.contentRepository.findById(id);
    if (!content) {
      throw new ContentNotFoundError(`Content with id ${id} not found`);
    }
    if (content.userId !== userId) {
      throw new Error('Unauthorized: You can only delete your own content');
    }
    await this.storage.delete(content.location);
    await this.contentRepository.delete(id);
    return { message: 'Content deleted successfully' };
  }
}
