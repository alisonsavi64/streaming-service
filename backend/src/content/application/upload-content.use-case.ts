import { StoragePort } from '../domain/storage.port';
import { ContentRepository } from '../domain/content.repository';
import { Content } from '../domain/content.entity';

export class UploadContentUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly contentRepository: ContentRepository,
  ) {}

  async execute(params: {
    title: string;
    description: string;
    file: Buffer;
    filename: string;
    mimeType: string;
  }): Promise<Content> {
    const { location } = await this.storage.upload({
      file: params.file,
      filename: params.filename,
      mimeType: params.mimeType,
    });
    console.log(location)
    const content = Content.create({
      title: params.title,
      description: params.description,
      location
    });

    await this.contentRepository.save(content);

    return content;
  }
}
