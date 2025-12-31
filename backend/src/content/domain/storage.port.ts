export interface StoragePort {
  uploadRaw(params: {
    contentId: string;
    file: Buffer;
    filename: string;
    mimeType: string;
  }): Promise<void>;
  delete(location: string): Promise<void>; 
}
