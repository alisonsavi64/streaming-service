import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Put,
  Req,
  UseGuards,
  Logger,
  Post
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
    private readonly deleteUser: DeleteUserUseCase
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Cria um novo usuário no sistema com nome, email e senha. Retorna as informações do usuário criado.'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Já existe um usuário com este email' })
  async register(@Body() dto: RegisterDto) {
    this.logger.log({ email: dto.email }, 'Tentativa de registro de usuário');

    try {
      const user = await this.registerUseCase.execute(dto.name, dto.email, dto.password);
      this.logger.log({ userId: user.id }, 'Usuário registrado com sucesso');
      return user;
    } catch (error) {
      this.logger.error({ err: error, email: dto.email }, 'Falha no registro de usuário');
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar usuário logado',
    description: 'Atualiza as informações do usuário atualmente autenticado (nome, email ou senha).'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user.id;

    this.logger.log({ userId }, 'Solicitação de atualização de usuário');

    const updated = await this.updateUser.execute(userId, dto.name, dto.email, dto.password);

    this.logger.log({ userId }, 'Usuário atualizado com sucesso');

    return updated;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletar usuário logado',
    description: 'Deleta o usuário atualmente autenticado e todos os conteúdos relacionados a ele.'
  })
  @ApiResponse({ status: 200, description: 'Usuário e conteúdos deletados com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async delete(@Req() req: any) {
    const userId = req.user.id;

    this.logger.warn({ userId }, 'Solicitação de exclusão de usuário');

    await this.deleteUser.execute(userId);

    this.logger.warn({ userId }, 'Usuário deletado com sucesso');

    return { message: 'Usuário e todos os conteúdos deletados' };
  }
}
