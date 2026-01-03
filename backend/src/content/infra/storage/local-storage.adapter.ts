import { Injectable } from '@nestjs/common';
import { StoragePort } from '../../domain/storage.port';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageAdapter implements StoragePort {
  private readonly basePath = '/storage';

  async uploadRaw({
    contentId,
    file,
    filename,
  }: {
    contentId: string;
    file: Buffer;
    filename: string;
    mimeType: string;
  }): Promise<void> {
    const dir = path.join(this.basePath, 'raw', contentId);
    await fs.mkdir(dir, { recursive: true });

    const ext = path.extname(filename);
    const fullPath = path.join(dir, `source${ext}`);

    await fs.writeFile(fullPath, file);
  }

  async uploadThumbnail({
    contentId,
    file,
    filename,
  }: {
    contentId: string;
    file: Buffer;
    filename: string;
  }) {
    const dir = `/storage/thumbnails/${contentId}`;
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, 'thumbnail.jpg');
    await fs.rm(filePath, { force: true });
    await fs.writeFile(filePath, file);
    return `/thumbnails/${contentId}/thumbnail.jpg`;
  }

  async delete(contentId: string): Promise<void> {
    const uploadDir = path.join(this.basePath, 'uploads', contentId);
    const processedDir = path.join(this.basePath, 'processed', contentId);
    await Promise.all([
      fs.rm(uploadDir, { recursive: true, force: true }),
      fs.rm(processedDir, { recursive: true, force: true }),
    ]);
  }
}