import { Injectable } from '@nestjs/common';
import { StoragePort } from '../../domain/storage.port';
import { promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class LocalStorageAdapter implements StoragePort {
  private readonly basePath = path.resolve(
    process.cwd(),
    'storage',
  );

  async upload({ file, filename }: {
    file: Buffer;
    filename: string;
    mimeType: string;
  }): Promise<{ location: string }> {
    await fs.mkdir(this.basePath, { recursive: true });

    const fileId = randomUUID();
    const storedName = `${fileId}-${filename}`;
    const fullPath = path.join(this.basePath, storedName);

    await fs.writeFile(fullPath, file);

    return {
      location: `/storage/${storedName}`,
    };
  }
}
