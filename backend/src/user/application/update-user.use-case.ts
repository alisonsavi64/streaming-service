import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../domain/user.repository';
import { hash } from 'bcrypt';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(userId: string, name?: string, email?: string, password?: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.passwordHash = await hash(password, 10);

    return this.userRepository.save(user);
  }
}
