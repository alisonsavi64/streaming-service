import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';
import { UserOrmEntity } from './user.orm-entity';

export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.repo.findOne({
      where: { email },
    });

    if (!ormUser) return null;

    return new User(
      ormUser.id,
      ormUser.name,
      ormUser.email,
      ormUser.passwordHash,
    );
  }

  async save(user: User): Promise<void> {
    const ormUser = this.repo.create({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.getPasswordHash(),
    });

    await this.repo.save(ormUser);
  }
}
