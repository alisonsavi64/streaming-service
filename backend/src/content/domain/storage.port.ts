export interface StoragePort {
  upload(params: {
    file: Buffer;
    filename: string;
    mimeType: string;
  }): Promise<{
    location: string;
  }>;
}
