import { Content } from './content.entity';
import { ContentStatus } from './content.status';
import { ContentGenre } from './content.genre';

export interface ContentRepository {
  findAll(): Promise<Content[]>;
  findAllByUserId(userId: string): Promise<Content[]>;
  findById(id: string): Promise<Content | null>;
  findByUserId(userId: string): Promise<Content[]>;
  save(content: Content): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  update(
    id: string,
    fields: Partial<{
      title: string;
      description: string;
      genre: ContentGenre;
    }>,
  ): Promise<void>;
  findStuckVideos(statuses: ContentStatus[]): Promise<Content[]>;
  search(query: string): Promise<Content[]>;
  incrementViews(id: string): Promise<void>;
}
