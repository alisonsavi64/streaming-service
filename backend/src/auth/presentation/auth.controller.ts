import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { LoginUseCase } from '../application/login.use-case';
import { InvalidCredentialsError } from '../domain/auth.erros';
import { UserAlreadyExistsError } from '../domain/auth.erros';
import { RegisterDto } from './register.dto';
import { RegisterUserUseCase } from '../application/register-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase, private readonly registerUseCase: RegisterUserUseCase) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginUseCase.execute(dto.email, dto.password);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
        return await this.registerUseCase.execute(
        dto.name,
        dto.email,
        dto.password,
        );
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
        }
        throw error;
    }
  }

}
