import { Body, ConflictException, Controller, Delete, Get, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { LoginUseCase } from '../application/login.use-case';
import { InvalidCredentialsError } from '../domain/auth.erros';
import { RegisterDto } from '../../user/presentation/register.dto';
import { RegisterUserUseCase } from '../../user/application/register-user.use-case';
import { JwtAuthGuard } from '../application/jwt-auth.guard';
import { UpdateUserDto } from '../../user/presentation/update-user.dto';
import { UpdateUserUseCase } from '../../user/application/update-user.use-case';
import { DeleteUserUseCase } from '../../user/application/delete-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase, 
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }

}
