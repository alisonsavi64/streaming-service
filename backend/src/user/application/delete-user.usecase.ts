import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../domain/user.repository';
import type { ContentRepository } from '../../content/domain/content.repository';
import * as fs from 'fs/promises';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly contentRepo: ContentRepository,
  ) {}

  async execute(userId: string) {
    const contents = await this.contentRepo.findByUserId(userId);
    for (const content of contents) {
      try {
        await fs.unlink(content.location);
      } catch (err) {
        console.warn(`Failed to delete file ${content.location}:`, err);
      }
    }
    await this.contentRepo.deleteByUserId(userId);
    await this.userRepo.delete(userId);
  }
}
