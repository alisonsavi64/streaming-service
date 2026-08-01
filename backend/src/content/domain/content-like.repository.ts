export interface ContentLikeRepository {
  like(contentId: string, userId: string): Promise<void>;
  unlike(contentId: string, userId: string): Promise<void>;
  isLikedByUser(contentId: string, userId: string): Promise<boolean>;
  countByContentId(contentId: string): Promise<number>;
  countByContentIds(contentIds: string[]): Promise<Record<string, number>>;
}
