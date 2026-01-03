import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../domain/user.repository';
import { hash } from 'bcrypt';
import { UserAlreadyExistsError } from '../domain/user.errors';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    name?: string,
    email?: string,
    password?: string,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found'); 
    }
    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new UserAlreadyExistsError();
      }
      user.email = email;
    }
    if (name) {
      user.name = name;
    }
    if (password) {
      user.passwordHash = await hash(password, 10);
    }
    return this.userRepository.save(user);
  }
}
