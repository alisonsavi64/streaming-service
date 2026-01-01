import { 
  Body, 
  ConflictException, 
  Controller, 
  Delete, 
  Get, 
  Post, 
  Put, 
  Req, 
  UnauthorizedException, 
  UseGuards, 
  Logger 
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

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase
  ) {}


  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  async register(@Body() dto: RegisterDto) {
    this.logger.log({ email: dto.email }, 'User registration attempt');

    try {
      const user = await this.registerUseCase.execute(dto.name, dto.email, dto.password);
      this.logger.log({ userId: user.id }, 'User registered successfully');
      return user;
    } catch (error) {
      this.logger.error({ err: error, email: dto.email }, 'User registration failed');
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the current logged-in user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user.id;

    this.logger.log({ userId }, 'User update requested');

    const updated = await this.updateUser.execute(userId, dto.name, dto.email, dto.password);

    this.logger.log({ userId }, 'User updated successfully');

    return updated;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete the current logged-in user and all their contents' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Req() req: any) {
    const userId = req.user.id;

    this.logger.warn({ userId }, 'User deletion requested');

    await this.deleteUser.execute(userId);

    this.logger.warn({ userId }, 'User deleted successfully');

    return { message: 'User and all contents deleted' };
  }
}
