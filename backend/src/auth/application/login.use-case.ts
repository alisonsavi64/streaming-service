import { UserRepository } from '../../user/domain/user.repository';
import { InvalidCredentialsError } from '../domain/auth.erros';
import { JwtService } from '@nestjs/jwt';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly passwordCompare: (a: string, b: string) => boolean,
  ) { }

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = user.validatePassword(password, this.passwordCompare);

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name
    });

    return { access_token: token, user: { name: user.name, email: user.email, id: user.id } };
  }
}
