import { ContentRepository } from '../domain/content.repository';
import { ContentNotFoundError } from '../domain/content.errors';
import { StoragePort } from '../domain/storage.port';

export class UpdateContentUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly storage: StoragePort
  ) {}

async execute(
  id: string,
  userId: string,
  data: { title?: string; description?: string },
  thumbnail?: { buffer: Buffer; filename: string; mimeType: string } | null
) {
  const content = await this.contentRepository.findById(id);
  if (!content) throw new ContentNotFoundError(`Content with id ${id} not found`);
  if (content.userId !== userId) throw new Error('Unauthorized: You can only update your own content');
  if (data.title) content.title = data.title;
  if (data.description) content.description = data.description;
  if (thumbnail) {
    const thumbnailUrl = await this.storage.uploadThumbnail({
      contentId: id,
      file: thumbnail.buffer,
      filename: thumbnail.filename,
      mimeType: thumbnail.mimeType,
    });
    content.setThumbnail(thumbnailUrl);
  }

  await this.contentRepository.save(content);

  return { message: 'Content updated successfully', content };
}

}
