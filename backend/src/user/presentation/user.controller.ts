import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Put,
  Req,
  UseGuards,
  Logger,
  Post,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '../domain/user.errors';
import { RegisterDto } from './register.dto';
import { RegisterUserUseCase } from '../application/register-user.use-case';
import { JwtAuthGuard } from '../../auth/application/jwt-auth.guard';
import { UpdateUserDto } from './update-user.dto';
import { UpdateUserUseCase } from '../application/update-user.use-case';
import { DeleteUserUseCase } from '../application/delete-user.usecase';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UserResponseDto } from './user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria um novo usuário no sistema com nome, email e senha. Retorna as informações do usuário criado.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'A user with this email already exists',
  })
  async register(@Body() dto: RegisterDto) {
    this.logger.log({ email: dto.email }, 'Tentativa de registro de usuário');

    try {
      const user = await this.registerUseCase.execute(
        dto.name,
        dto.email,
        dto.password,
      );
      this.logger.log({ userId: user.id }, 'User registered successfully');
      return user;
    } catch (error) {
      this.logger.error(
        { err: error, email: dto.email },
        'User registration failed',
      );
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException('A user with this email already exists');
      }
      throw new InternalServerErrorException(
        'Internal server error while registering user',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar usuário logado',
    description:
      'Atualiza as informações do usuário atualmente autenticado (nome, email ou senha).',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user.id;
    this.logger.log({ userId }, 'User update request');

    try {
      const updated = await this.updateUser.execute(
        userId,
        dto.name,
        dto.email,
        dto.password,
      );
      this.logger.log({ userId }, 'User updated successfully');
      return updated;
    } catch (error) {
      this.logger.error({ err: error, userId }, 'User update failed');
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException('A user with this email already exists');
      }
      throw new InternalServerErrorException(
        'Internal server error while updating user',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar usuário logado',
    description:
      'Deleta o usuário atualmente autenticado e todos os conteúdos relacionados a ele.',
  })
  @ApiResponse({
    status: 200,
    description: 'User and all related content deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Req() req: any) {
    const userId = req.user.id;
    this.logger.warn({ userId }, 'User deletion request');

    try {
      await this.deleteUser.execute(userId);
      this.logger.warn({ userId }, 'User deleted successfully');
      return { message: 'User and all related content deleted successfully' };
    } catch (err: any) {
      this.logger.error({ err, userId }, 'User deletion failed');
      throw new InternalServerErrorException(
        'Internal server error while deleting user',
      );
    }
  }
}
