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

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentOrmEntity]),
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
      useFactory: (storage: StoragePort, repository: ContentRepository) =>
        new UploadContentUseCase(storage, repository),
      inject: [STORAGE_PORT, CONTENT_REPOSITORY],
    },
  ],
})
export class ContentModule {}

