import { EventBus } from "src/shared/application/messaging/event-bus.port";
import { Content } from "../domain/content.entity";
import { ContentRepository } from "../domain/content.repository";
import { StoragePort } from "../domain/storage.port";

export class UploadContentUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly contentRepository: ContentRepository,
    private readonly eventBus: EventBus
  ) { }

  async execute(params: {
    title: string;
    description: string;
    userId: string;
  }): Promise<Content> {
    const content = Content.create({
      title: params.title,
      description: params.description,
      userId: params.userId,
    });
  
    await this.contentRepository.save(content);

    return content;
  }
}
