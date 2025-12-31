import { Body, ConflictException, Controller, Delete, Get, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserAlreadyExistsError } from '../domain/user.errors';
import { RegisterDto } from './register.dto';
import { RegisterUserUseCase } from '../application/register-user.use-case';
import { JwtAuthGuard } from '../../auth/application/jwt-auth.guard';
import { UpdateUserDto } from './update-user.dto';
import { UpdateUserUseCase } from '../application/update-user.use-case';
import { DeleteUserUseCase } from '../application/delete-user.usecase';

@Controller('user')
export class UserController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post('')
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

  @UseGuards(JwtAuthGuard)
  @Put('')
  async updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    const updated = await this.updateUser.execute(
      req.user.useId,
      dto.name,
      dto.email,
      dto.password,
    );
    return updated;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deleteMe(@Req() req: any) {
    await this.deleteUser.execute(req.user.userId);
    return { message: 'User and all contents deleted' };
  }
}
