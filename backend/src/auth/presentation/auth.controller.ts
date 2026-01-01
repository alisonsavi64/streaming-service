import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Req, 
  Res, 
  UnauthorizedException, 
  UseGuards, 
  Logger 
} from '@nestjs/common';
import { LoginDto } from './login.dto';
import { LoginUseCase } from '../application/login.use-case';
import { InvalidCredentialsError } from '../domain/auth.erros';
import { JwtAuthGuard } from '../application/jwt-auth.guard';
import type { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    this.logger.log({ email: dto.email }, 'Login attempt');

    try {
      const result = await this.loginUseCase.execute(dto.email, dto.password);

      reply.setCookie('access_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });

      this.logger.log({ userId: result.user.id }, 'Login successful');
      return result.user;
    } catch (error) {
      this.logger.error(error, `Login failed for email ${dto.email}`);
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    this.logger.log({ userId: req.user.id }, 'Fetching current user');
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    this.logger.log('Logout requested');
    reply.clearCookie('access_token', { path: '/' });
    this.logger.log('Logout successful');
    return { success: true };
  }
}
