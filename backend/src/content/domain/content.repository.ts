import { Content } from './content.entity';

export interface ContentRepository {
  findAll(): Promise<Content[]>;
  findAllByUserId(userId: string): Promise<Content[]>;
  findById(id: string): Promise<Content | null>;
  findByUserId(userId: string): Promise<Content[]>;
  save(content: Content): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  update(id: string, fields: Partial<{ title: string; description: string }>): Promise<void>;
}
