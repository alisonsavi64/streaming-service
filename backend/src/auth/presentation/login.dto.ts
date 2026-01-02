import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'Password of the user, minimum 6 characters', minLength: 6, example: 'secret123' })
  password: string;
}
