import { Content } from './content.entity';

export interface ContentRepository {
  findAll(): Promise<Content[]>;
  findById(id: string): Promise<Content | null>;
  save(content: Content): Promise<void>;
}
