import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto } from './login.dto';
import { LoginUseCase } from '../application/login.use-case';
import { InvalidCredentialsError } from '../domain/auth.erros';
import { JwtAuthGuard } from '../application/jwt-auth.guard';
import type { FastifyReply } from 'fastify';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UserResponseDto } from '../../user/presentation/user.dto';
import { AuthResponseDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login do usuário',
    description:
      'Autentica o usuário utilizando e-mail e senha, define um cookie HTTP-only e retorna informações do usuário junto com o token JWT.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description:
      'Login successful, returns user info and JWT',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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

      this.logger.log(
        { userId: result.user.id },
        'Login successful',
      );
      return result;
    } catch (error) {
      this.logger.error(error, `Login failed for email ${dto.email}`);
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException('Internal server error while logging in');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter usuário logado',
    description:
      'Retorna informações sobre o usuário atualmente autenticado com base nos cookies da requisição.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns logged-in user info',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  me(@Req() req: any) {
    this.logger.log({ userId: req.user.id }, 'Fetching current user');
    return req.user;
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout do usuário',
    description:
      'Limpa o cookie HTTP-only do JWT para desconectar o usuário do sistema.',
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    this.logger.log('Logout requested');
    reply.clearCookie('access_token', { path: '/' });
    this.logger.log('Logout successful');
    return { success: true };
  }
}
