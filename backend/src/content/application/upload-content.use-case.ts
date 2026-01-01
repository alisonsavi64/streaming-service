import { EventBus } from "src/shared/application/messaging/event-bus.port";
import { Content } from "../domain/content.entity";
import { ContentRepository } from "../domain/content.repository";
import { StoragePort } from "../domain/storage.port";

export class UploadContentUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly contentRepository: ContentRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(params: {
    title: string;
    description: string;
    userId: string;
    video: {
      buffer: Buffer;
      filename: string;
      mimeType: string;
    };
    thumbnail: {
      buffer: Buffer;
      filename: string;
      mimeType: string;
    };
  }): Promise<Content> {
    const content = Content.create({
      title: params.title,
      description: params.description,
      userId: params.userId,
    });

    await this.storage.uploadRaw({
      contentId: content.id,
      file: params.video.buffer,
      filename: params.video.filename,
      mimeType: params.video.mimeType,
    });

    const thumbnailUrl = await this.storage.uploadThumbnail({
      contentId: content.id,
      file: params.thumbnail.buffer,
      filename: params.thumbnail.filename,
      mimeType: params.thumbnail.mimeType,
    });

    content.setThumbnail(thumbnailUrl);

    await this.contentRepository.save(content);

    await this.eventBus.publish('content.uploaded', {
      contentId: content.id,
      userId: content.userId,
      thumbnailUrl,
    });

    return content;
  }
}
