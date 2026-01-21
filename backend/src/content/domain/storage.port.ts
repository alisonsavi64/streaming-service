import { Readable } from 'node:stream';

export interface StoragePort {
  uploadRaw(params: {
    contentId: string;
    file: Buffer;
    filename: string;
    mimeType: string;
  }): Promise<void>;
  uploadThumbnail(params: {
    contentId: string;
    file: Buffer;
    filename: string;
    mimeType: string;
  }): Promise<string>;
    uploadRawStream(input: {
    contentId: string;
    stream: Readable;
    filename: string;
    mimeType: string;
  }): Promise<void>;

  uploadThumbnailStream(input: {
    contentId: string;
    stream: Readable;
    filename: string;
    mimeType: string;
  }): Promise<string>;
  delete(contentId: string): Promise<void>;
}
