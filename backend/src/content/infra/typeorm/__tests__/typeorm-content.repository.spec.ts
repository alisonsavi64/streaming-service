import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmContentRepository } from '../typeorm-content.repository';
import { ContentOrmEntity } from '../content.orm-entity';
import { Content } from '../../../domain/content.entity';
import { ContentStatus } from '../../../domain/content.status';

describe('TypeOrmContentRepository (integration)', () => {
  let repo: TypeOrmContentRepository;
  let repository: Repository<ContentOrmEntity>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'postgres',
          port: 5432,
          username: 'streaming',
          password: 'streaming',
          database: 'streaming_test',
          synchronize: true,
          dropSchema: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([ContentOrmEntity]),
      ],
      providers: [TypeOrmContentRepository],
    }).compile();

    repo = module.get(TypeOrmContentRepository);
    repository = module.get<Repository<ContentOrmEntity>>(getRepositoryToken(ContentOrmEntity));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await repository.query('TRUNCATE TABLE "contents" RESTART IDENTITY CASCADE');
  });

  it('should save and retrieve a content', async () => {
    const content = Content.create({ title: 'Video 1', description: 'Desc', userId: 'user1' });
    await repo.save(content);

    const foundById = await repo.findById(content.id);
    expect(foundById).not.toBeNull();
    expect(foundById?.title).toBe('Video 1');

    const allProcessed = await repo.findAll();
    expect(allProcessed.length).toBe(0); 

    content.markReady();
    await repo.save(content);
    const processed = await repo.findAll();
    expect(processed.length).toBe(1);
  });

  it('should update a content', async () => {
    const content = Content.create({ title: 'Old', description: 'Old Desc', userId: 'user1' });
    await repo.save(content);

    await repo.update(content.id, { title: 'New', description: 'New Desc' });
    const updated = await repo.findById(content.id);
    expect(updated?.title).toBe('New');
    expect(updated?.description).toBe('New Desc');
  });

  it('should delete content by id', async () => {
    const content = Content.create({ title: 'Video', description: 'Desc', userId: 'user1' });
    await repo.save(content);

    await repo.delete(content.id);
    const found = await repo.findById(content.id);
    expect(found).toBeNull();
  });

  it('should find content by userId', async () => {
    const content1 = Content.create({ title: 'V1', description: 'D1', userId: 'user1' });
    const content2 = Content.create({ title: 'V2', description: 'D2', userId: 'user2' });
    await repo.save(content1);
    await repo.save(content2);

    const user1Contents = await repo.findByUserId('user1');
    expect(user1Contents.length).toBe(1);
    expect(user1Contents[0].title).toBe('V1');
  });

  it('should delete all contents by userId', async () => {
    const content1 = Content.create({ title: 'V1', description: 'D1', userId: 'user1' });
    const content2 = Content.create({ title: 'V2', description: 'D1', userId: 'user1' });
    await repo.save(content1);
    await repo.save(content2);

    await repo.deleteByUserId('user1');
    const userContents = await repo.findByUserId('user1');
    expect(userContents.length).toBe(0);
  });
});
