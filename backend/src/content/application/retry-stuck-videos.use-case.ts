import { Injectable } from '@nestjs/common'
import type { ContentRepository } from '../domain/content.repository'
import { ContentStatus } from '../domain/content.status'
import type { EventBus } from '../../shared/application/messaging/event-bus.port'

@Injectable()
export class RetryStuckVideosUseCase {
  constructor(
    private readonly contentRepo: ContentRepository,
    private readonly eventBus: EventBus,
  ) { }

  async execute(): Promise<number> {
    const stuckVideos = await this.contentRepo.findStuckVideos([
      ContentStatus.UPLOADED,
      ContentStatus.PROCESSING,
    ])
    for (const video of stuckVideos) {
      await this.eventBus.publish('content.uploaded', {
        contentId: video.id,
        userId: video.userId,
        thumbnailUrl: video.thumbnailUrl,
      })
    }

    return stuckVideos.length
  }
}
