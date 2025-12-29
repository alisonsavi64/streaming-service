import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import * as bcrypt from 'bcrypt';

export class TypeOrmUserRepository implements UserRepository {
  private users: User[] = [
    new User(
      '1',
      'Admin',
      'admin@streaming.com',
      bcrypt.hashSync('123456', 10),
    ),
  ];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
