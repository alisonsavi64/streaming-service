import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User name' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ description: 'User email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiPropertyOptional({ description: 'User password, minimum 6 characters' })
  password?: string;
}
