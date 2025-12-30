import { UserRepository } from '../domain/user.repository';
import { UserAlreadyExistsError } from '../domain/auth.erros';
import { User } from '../domain/user.entity';
import { randomUUID } from 'crypto';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPassword: (password: string) => string,
  ) {}

  async execute(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = this.hashPassword(password);

    const user = User.create(
      randomUUID(),
      name,
      email,
      passwordHash,
    );

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
