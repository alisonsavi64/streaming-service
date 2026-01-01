import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from '../typeorm-user.repository';
import { UserOrmEntity } from '../user.orm-entity';
import { User } from '../../../domain/user.entity';

describe('TypeOrmUserRepository (integration)', () => {
  let repo: TypeOrmUserRepository;
  let repository: Repository<UserOrmEntity>;
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
        TypeOrmModule.forFeature([UserOrmEntity]),
      ],
      providers: [TypeOrmUserRepository],
    }).compile();

    repo = module.get(TypeOrmUserRepository);
    repository = module.get<Repository<UserOrmEntity>>(getRepositoryToken(UserOrmEntity));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await repository.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
  });

  it('should save and retrieve a user by ID and email', async () => {
    const user = User.create('1', 'Alice', 'alice@example.com', 'hashedPassword');
    await repo.save(user);

    const foundById = await repo.findById('1');
    expect(foundById).toBeInstanceOf(User);
    expect(foundById?.email).toBe('alice@example.com');

    const foundByEmail = await repo.findByEmail('alice@example.com');
    expect(foundByEmail?.name).toBe('Alice');
  });

  it('should delete a user', async () => {
    const user = User.create('2', 'Bob', 'bob@example.com', 'hashedPassword');
    await repo.save(user);

    await repo.delete('2');
    const found = await repo.findById('2');
    expect(found).toBeNull();
  });
});
