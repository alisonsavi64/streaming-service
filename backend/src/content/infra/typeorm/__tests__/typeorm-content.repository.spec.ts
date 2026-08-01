import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TypeOrmContentRepository } from '../typeorm-content.repository';
import { ContentOrmEntity } from '../content.orm-entity';
import { Content } from '../../../domain/content.entity';
import { UserOrmEntity } from '../../../../user/infra/typeorm/user.orm-entity';
import { User } from '../../../../user/domain/user.entity';

describe('TypeOrmContentRepository (integration)', () => {
  let repo: TypeOrmContentRepository;
  let repository: Repository<ContentOrmEntity>;
  let userRepository: Repository<UserOrmEntity>;
  let dataSource: DataSource;

  beforeAll(async () => {
    jest.setTimeout(30000);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: (process.env.DATABASE_TYPE as any) || 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          username: process.env.DATABASE_USER || 'streaming',
          password: process.env.DATABASE_PASSWORD || 'streaming',
          database: process.env.DATABASE_NAME || 'streaming',
          synchronize: false,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([ContentOrmEntity, UserOrmEntity]),
      ],
      providers: [TypeOrmContentRepository],
    }).compile();

    repo = module.get(TypeOrmContentRepository);
    repository = module.get<Repository<ContentOrmEntity>>(getRepositoryToken(ContentOrmEntity));
    userRepository = module.get<Repository<UserOrmEntity>>(getRepositoryToken(UserOrmEntity));
    dataSource = module.get<DataSource>(DataSource);
  }, 30000);

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await repository.query('TRUNCATE TABLE "contents" RESTART IDENTITY CASCADE');
    await userRepository.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
  });

  const createTestUser = async () => {
    const email = `user_${Math.random().toString(36).substring(2, 10)}@example.com`;
    const user = User.create(uuidv4(), 'Test User', email, 'hashedPassword');
    await userRepository.save(user); 
    return user;
  };

  it('should save and retrieve a content', async () => {
    const user = await createTestUser();
    const content = Content.create({ title: 'Video 1', description: 'Desc', userId: user.id });
    await repo.save(content);

    const foundById = await repo.findById(content.id);
    expect(foundById).not.toBeNull();
    expect(foundById?.title).toBe('Video 1');

    const allProcessed = await repo.findAll();
    expect(allProcessed.length).toBe(0);

    content.markReady();
    await repo.update(content.id, content);
    const processed = await repo.findAll();
    expect(processed.length).toBe(1);
  });

  it('should update a content', async () => {
    const user = await createTestUser();
    const content = Content.create({ title: 'Old', description: 'Old Desc', userId: user.id });
    await repo.save(content);

    await repo.update(content.id, { title: 'New', description: 'New Desc' });
    const updated = await repo.findById(content.id);
    expect(updated?.title).toBe('New');
    expect(updated?.description).toBe('New Desc');
  });

  it('should delete content by id', async () => {
    const user = await createTestUser();
    const content = Content.create({ title: 'Video', description: 'Desc', userId: user.id });
    await repo.save(content);

    await repo.delete(content.id);
    const found = await repo.findById(content.id);
    expect(found).toBeNull();
  });

  it('should find content by userId', async () => {
    const user1 = await createTestUser();
    const user2 = await createTestUser();

    const content1 = Content.create({ title: 'V1', description: 'D1', userId: user1.id });
    const content2 = Content.create({ title: 'V2', description: 'D2', userId: user2.id });
    await repo.save(content1);
    await repo.save(content2);

    const user1Contents = await repo.findByUserId(user1.id);
    expect(user1Contents.length).toBe(1);
    expect(user1Contents[0].title).toBe('V1');
  });

  it('should delete all contents by userId', async () => {
    const user = await createTestUser();

    const content1 = Content.create({ title: 'V1', description: 'D1', userId: user.id });
    const content2 = Content.create({ title: 'V2', description: 'D1', userId: user.id });
    await repo.save(content1);
    await repo.save(content2);

    await repo.deleteByUserId(user.id);
    const userContents = await repo.findByUserId(user.id);
    expect(userContents.length).toBe(0);
  });

  describe('search', () => {
    it('should only return processed content matching the query in title or description', async () => {
      const user = await createTestUser();

      const dragons = Content.create({ title: 'Dragons documentary', description: 'A film about dragons', userId: user.id });
      const cooking = Content.create({ title: 'Cooking basics', description: 'Learn to cook pasta', userId: user.id });
      const unprocessed = Content.create({ title: 'Dragons unreleased', description: 'Not ready yet', userId: user.id });
      await repo.save(dragons);
      await repo.save(cooking);
      await repo.save(unprocessed);

      dragons.markReady();
      cooking.markReady();
      await repo.update(dragons.id, dragons);
      await repo.update(cooking.id, cooking);

      const results = await repo.search('dragons');
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Dragons documentary');
    });

    it('should rank results with more term matches higher', async () => {
      const user = await createTestUser();

      const strongMatch = Content.create({
        title: 'Ocean ocean waves',
        description: 'Ocean documentary about ocean life',
        userId: user.id,
      });
      const weakMatch = Content.create({
        title: 'Mountains',
        description: 'A short mention of ocean at the end',
        userId: user.id,
      });
      await repo.save(strongMatch);
      await repo.save(weakMatch);

      strongMatch.markReady();
      weakMatch.markReady();
      await repo.update(strongMatch.id, strongMatch);
      await repo.update(weakMatch.id, weakMatch);

      const results = await repo.search('ocean');
      expect(results.length).toBe(2);
      expect(results[0].title).toBe('Ocean ocean waves');
    });

    it('should return an empty array when nothing matches', async () => {
      const user = await createTestUser();
      const content = Content.create({ title: 'Space exploration', description: 'A journey to Mars', userId: user.id });
      await repo.save(content);
      content.markReady();
      await repo.update(content.id, content);

      const results = await repo.search('nonexistentterm');
      expect(results).toEqual([]);
    });
  });
});
