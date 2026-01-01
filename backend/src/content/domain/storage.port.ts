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
  delete(contentId: string): Promise<void>; 
}
