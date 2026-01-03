import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../domain/user.repository';
import type { ContentRepository } from '../../content/domain/content.repository';
import type { StoragePort } from '../../content/domain/storage.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly contentRepo: ContentRepository,
    private readonly storage: StoragePort,
  ) { }

  async execute(userId: string) {
    const contents = await this.contentRepo.findByUserId(userId);
    for (const content of contents) {
      try {
        await this.storage.delete(content.id);
      } catch (err) {
        console.warn(
          `Failed to delete content files ${content.id}:`,
          err
        );
      }
    }
    await this.contentRepo.deleteByUserId(userId);
    await this.userRepo.delete(userId);
  }
}
