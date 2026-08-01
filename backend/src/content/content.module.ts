import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { ContentController } from './presentation/content.controller';
import { ContentOrmEntity } from './infra/typeorm/content.orm-entity';
import { ContentLikeOrmEntity } from './infra/typeorm/content-like.orm-entity';
import { TypeOrmContentRepository } from './infra/typeorm/typeorm-content.repository';
import { TypeOrmContentLikeRepository } from './infra/typeorm/typeorm-content-like.repository';

import { ListContentsUseCase } from './application/list-contents.use-case';
import { GetContentByIdUseCase } from './application/get-content-by-id.use-case';
import { UploadContentUseCase } from './application/upload-content.use-case';
import { DeleteContentUseCase } from './application/delete-content.use-case';
import { UpdateContentUseCase } from './application/update-content.use-case';
import { MarkContentProcessedUseCase } from './application/mark-content-processed.use-case';
import { IncrementContentViewsUseCase } from './application/increment-content-views.use-case';
import { LikeContentUseCase } from './application/like-content.use-case';
import { UnlikeContentUseCase } from './application/unlike-content.use-case';
import { GetContentLikeStatusUseCase } from './application/get-content-like-status.use-case';

import { ContentRepository } from './domain/content.repository';
import { ContentLikeRepository } from './domain/content-like.repository';
import { CONTENT_REPOSITORY, STORAGE_PORT, CONTENT_LIKE_REPOSITORY } from './domain/content.tokens';
import { StoragePort } from './domain/storage.port';

import { LocalStorageAdapter } from './infra/storage/local-storage.adapter';
import { EventBus } from 'src/shared/application/messaging/event-bus.port';
import { ListUserContentsUseCase } from './application/list-user-contents.use-case';
import { MarkContentProcessingUseCase } from './application/mark-content-processing.use-case';
import { MarkContentFailedUseCase } from './application/mark-content-failed.use-case';
import { RetryStuckVideosUseCase } from './application/retry-stuck-videos.use-case';
import { RetryStuckVideosCronService } from './application/retry-stuck-videos-cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentOrmEntity, ContentLikeOrmEntity]),
    CacheModule.register({
      ttl: 30,
      max: 100,
    })
  ],
  controllers: [ContentController],
  providers: [
    {
      provide: CONTENT_REPOSITORY,
      useClass: TypeOrmContentRepository,
    },
    {
      provide: STORAGE_PORT,
      useClass: LocalStorageAdapter,
    },
    {
      provide: CONTENT_LIKE_REPOSITORY,
      useClass: TypeOrmContentLikeRepository,
    },
    {
      provide: ListContentsUseCase,
      useFactory: (repository: ContentRepository, likeRepository: ContentLikeRepository) =>
        new ListContentsUseCase(repository, likeRepository),
      inject: [CONTENT_REPOSITORY, CONTENT_LIKE_REPOSITORY],
    },
    {
      provide: GetContentByIdUseCase,
      useFactory: (repository: ContentRepository, likeRepository: ContentLikeRepository) =>
        new GetContentByIdUseCase(repository, likeRepository),
      inject: [CONTENT_REPOSITORY, CONTENT_LIKE_REPOSITORY],
    },
    {
      provide: UploadContentUseCase,
      useFactory: (
        storage: StoragePort,
        repository: ContentRepository,
        eventBus: EventBus,
      ) =>
        new UploadContentUseCase(storage, repository, eventBus),
      inject: [STORAGE_PORT, CONTENT_REPOSITORY, 'EventBus'],
    },
    {
      provide: DeleteContentUseCase,
      useFactory: (
        repository: ContentRepository,
        storage: StoragePort,
        eventBus: EventBus,
      ) =>
        new DeleteContentUseCase(repository, storage, eventBus),
      inject: [CONTENT_REPOSITORY, STORAGE_PORT, 'EventBus'],
    },
    {
      provide: UpdateContentUseCase,
      useFactory: (repository: ContentRepository, storage: StoragePort) =>
        new UpdateContentUseCase(repository, storage),
      inject: [CONTENT_REPOSITORY, STORAGE_PORT],
    },
    {
      provide: ListUserContentsUseCase,
      useFactory: (repository: ContentRepository, likeRepository: ContentLikeRepository) =>
        new ListUserContentsUseCase(repository, likeRepository),
      inject: [CONTENT_REPOSITORY, CONTENT_LIKE_REPOSITORY],
    },
    {
      provide: IncrementContentViewsUseCase,
      useFactory: (repository: ContentRepository) =>
        new IncrementContentViewsUseCase(repository),
      inject: [CONTENT_REPOSITORY],
    },
    {
      provide: LikeContentUseCase,
      useFactory: (repository: ContentRepository, likeRepository: ContentLikeRepository) =>
        new LikeContentUseCase(repository, likeRepository),
      inject: [CONTENT_REPOSITORY, CONTENT_LIKE_REPOSITORY],
    },
    {
      provide: UnlikeContentUseCase,
      useFactory: (repository: ContentRepository, likeRepository: ContentLikeRepository) =>
        new UnlikeContentUseCase(repository, likeRepository),
      inject: [CONTENT_REPOSITORY, CONTENT_LIKE_REPOSITORY],
    },
    {
      provide: GetContentLikeStatusUseCase,
      useFactory: (likeRepository: ContentLikeRepository) =>
        new GetContentLikeStatusUseCase(likeRepository),
      inject: [CONTENT_LIKE_REPOSITORY],
    },
    MarkContentProcessedUseCase,
    MarkContentProcessingUseCase,
    MarkContentFailedUseCase,
    {
      provide: RetryStuckVideosUseCase,
      useFactory: (repo: ContentRepository, eventBus: EventBus) =>
        new RetryStuckVideosUseCase(repo, eventBus),
      inject: [CONTENT_REPOSITORY, 'EventBus'],
    },
    RetryStuckVideosCronService
  ],
  exports: [MarkContentProcessedUseCase, MarkContentProcessingUseCase, MarkContentFailedUseCase, CONTENT_REPOSITORY, STORAGE_PORT],
})
export class ContentModule { }
