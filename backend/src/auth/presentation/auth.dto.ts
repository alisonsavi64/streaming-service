import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/presentation/user.dto';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'Logged in user information', type: () => UserResponseDto })
  user: UserResponseDto;
}