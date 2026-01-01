import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { ContentController } from './presentation/content.controller';
import { ContentOrmEntity } from './infra/typeorm/content.orm-entity';
import { TypeOrmContentRepository } from './infra/typeorm/typeorm-content.repository';

import { ListContentsUseCase } from './application/list-contents.use-case';
import { GetContentByIdUseCase } from './application/get-content-by-id.use-case';
import { UploadContentUseCase } from './application/upload-content.use-case';
import { DeleteContentUseCase } from './application/delete-content.use-case';
import { UpdateContentUseCase } from './application/update-content.use-case';
import { MarkContentProcessedUseCase } from './application/mark-content-processed.use-case';

import { ContentRepository } from './domain/content.repository';
import { CONTENT_REPOSITORY, STORAGE_PORT } from './domain/content.tokens';
import { StoragePort } from './domain/storage.port';

import { LocalStorageAdapter } from './infra/storage/local-storage.adapter';
import { EventBus } from 'src/shared/application/messaging/event-bus.port';
import { ListUserContentsUseCase } from './application/list-user-contents.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentOrmEntity]),
    CacheModule.register({
      ttl: 30,
      max: 100,
    }),
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
      provide: ListContentsUseCase,
      useFactory: (repository: ContentRepository) =>
        new ListContentsUseCase(repository),
      inject: [CONTENT_REPOSITORY],
    },
    {
      provide: GetContentByIdUseCase,
      useFactory: (repository: ContentRepository) =>
        new GetContentByIdUseCase(repository),
      inject: [CONTENT_REPOSITORY],
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
      useFactory: (repository: ContentRepository) =>
        new ListUserContentsUseCase(repository),
      inject: [CONTENT_REPOSITORY],
    },
    MarkContentProcessedUseCase,
  ],
  exports: [MarkContentProcessedUseCase, CONTENT_REPOSITORY, STORAGE_PORT],
})
export class ContentModule {}
