import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Name of the user', minLength: 2 })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'Password of the user, minimum 6 characters', minLength: 6 })
  password: string;
}
