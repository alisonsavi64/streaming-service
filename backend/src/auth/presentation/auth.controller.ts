import { Body, ConflictException, Controller, Delete, Get, Post, Put, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { LoginUseCase } from '../application/login.use-case';
import { InvalidCredentialsError } from '../domain/auth.erros';
import { RegisterUserUseCase } from '../../user/application/register-user.use-case';
import { JwtAuthGuard } from '../application/jwt-auth.guard';
import { UpdateUserUseCase } from '../../user/application/update-user.use-case';
import { DeleteUserUseCase } from '../../user/application/delete-user.usecase';
import type { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase, 
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

@Post('login')
async login(
  @Body() dto: LoginDto,
  @Res({ passthrough: true }) reply: FastifyReply,
) {
  try {
    const result = await this.loginUseCase.execute(dto.email, dto.password);

    reply.setCookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, 
    });

    return result.user;
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

  @Post('logout')
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    reply.clearCookie('access_token', { path: '/' });
    return { success: true };
  }

}
