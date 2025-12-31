import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContentController } from './presentation/content.controller';
import { ListContentsUseCase } from './application/list-contents.use-case';

import { ContentOrmEntity } from './infra/typeorm/content.orm-entity';
import { TypeOrmContentRepository } from './infra/typeorm/typeorm-content.repository';
import { ContentRepository } from './domain/content.repository';
import { CONTENT_REPOSITORY, STORAGE_PORT } from './domain/content.tokens';
import { GetContentByIdUseCase } from './application/get-content-by-id.use-case';
import { UploadContentUseCase } from './application/upload-content.use-case';
import { StoragePort } from './domain/storage.port';
import { LocalStorageAdapter } from './infra/storage/local-storage.adapter';
import { EventBus } from 'src/shared/application/messaging/event-bus.port';
import { MarkContentProcessedUseCase } from './application/mark-content-processed.use-case';
import { DeleteContentUseCase } from './application/delete-content.use-case';
import { UpdateContentUseCase } from './application/update-content.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentOrmEntity])
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
      useFactory: (storage: StoragePort, repository: ContentRepository, eventBus: EventBus) =>
        new UploadContentUseCase(storage, repository, eventBus),
      inject: [STORAGE_PORT, CONTENT_REPOSITORY, 'EventBus'],
    },
    {
      provide: DeleteContentUseCase,
      useFactory: (repository: ContentRepository, storage: StoragePort, eventBus: EventBus) =>
        new DeleteContentUseCase(repository, storage, eventBus),
      inject: [CONTENT_REPOSITORY, STORAGE_PORT, 'EventBus'],
    },
    {
      provide: UpdateContentUseCase,
      useFactory: (repository: ContentRepository) =>
        new UpdateContentUseCase(repository),
      inject: [CONTENT_REPOSITORY],
    },
    MarkContentProcessedUseCase
  ],
  exports: [MarkContentProcessedUseCase, CONTENT_REPOSITORY],
})
export class ContentModule {}

