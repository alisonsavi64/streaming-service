import User from './user.enity';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
}
