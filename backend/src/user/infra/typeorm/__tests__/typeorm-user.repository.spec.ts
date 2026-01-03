import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from '../typeorm-user.repository';
import { UserOrmEntity } from '../user.orm-entity';
import { User } from '../../../domain/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { ContentOrmEntity } from '../../../../content/infra/typeorm/content.orm-entity';

describe('TypeOrmUserRepository (integration)', () => {
  let repo: TypeOrmUserRepository;
  let repository: Repository<UserOrmEntity>;
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
        TypeOrmModule.forFeature([UserOrmEntity, ContentOrmEntity]),
      ],
      providers: [TypeOrmUserRepository],
    }).compile();

    repo = module.get(TypeOrmUserRepository);
    repository = module.get<Repository<UserOrmEntity>>(getRepositoryToken(UserOrmEntity));
    dataSource = module.get<DataSource>(DataSource);
  }, 30000);

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await repository.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
  });

  it('should save and retrieve a user by ID and email', async () => {
    const randomEmail = `user_${Math.random().toString(36).substring(2, 10)}@example.com`;
    const user = User.create(uuidv4(), 'Alice', randomEmail, 'hashedPassword');
    await repo.save(user);

    const foundById = await repo.findById(user.id);
    expect(foundById?.email).toBe(randomEmail);

    const foundByEmail = await repo.findByEmail(randomEmail);
    expect(foundByEmail?.name).toBe('Alice');
  });

  it('should delete a user', async () => {
    const randomEmail = `user_${Math.random().toString(36).substring(2, 10)}@example.com`;
    const user = User.create(uuidv4(), 'Bob', randomEmail, 'hashedPassword');
    await repo.save(user);

    await repo.delete(user.id);
    const found = await repo.findById(user.id);
    expect(found).toBeNull();
  });
});
