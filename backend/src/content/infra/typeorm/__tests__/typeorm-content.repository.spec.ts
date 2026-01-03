import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TypeOrmContentRepository } from '../typeorm-content.repository';
import { ContentOrmEntity } from '../content.orm-entity';
import { Content } from '../../../domain/content.entity';
import { UserOrmEntity } from '../../../../user/infra/typeorm/user.orm-entity';

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
    const email = `test-${uuidv4()}@example.com`;
    const user = userRepository.create({
      name: 'Test User',
      email,
    });
    user.passwordHash = 'hashedPassword';
    await userRepository.save(user);
    const createdUser = await userRepository.findOneBy({ email }); 
    return createdUser;
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
});
