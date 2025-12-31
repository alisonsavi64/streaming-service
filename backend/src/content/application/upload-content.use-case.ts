import type { StoragePort } from '../domain/storage.port';
import type { ContentRepository } from '../domain/content.repository';
import { Content } from '../domain/content.entity';
import type { EventBus } from 'src/shared/application/messaging/event-bus.port';

export class UploadContentUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly contentRepository: ContentRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(params: {
    title: string;
    description: string;
    file: Buffer;
    filename: string;
    mimeType: string;
    userId: string;
  }): Promise<Content> {
    const { location } = await this.storage.upload({
      file: params.file,
      filename: params.filename,
      mimeType: params.mimeType,
    });
    const content = Content.create({
      title: params.title,
      description: params.description,
      location,
      userId: params.userId
    });

    await this.contentRepository.save(content);

    await this.eventBus.publish('content.uploaded', {
      contentId: content.id,
      videoPath: content.location,
      userId: content.userId
    })

    return content;
  }
}
