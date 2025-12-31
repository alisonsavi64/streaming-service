import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthController } from './presentation/auth.controller';
import { LoginUseCase } from './application/login.use-case';
import { RegisterUserUseCase } from '../user/application/register-user.use-case';
import { TypeOrmUserRepository } from '../user/infra/typeorm/typeorm-user.repository';
import { UserOrmEntity } from '../user/infra/typeorm/user.orm-entity';
import { UserRepository } from '../user/domain/user.repository';
import { JwtStrategy } from './application/jwt.strategy';
import { UpdateUserUseCase } from '../user/application/update-user.use-case';
import { DeleteUserUseCase } from '../user/application/delete-user.usecase';
import { ContentRepository } from 'src/content/domain/content.repository';
import { CONTENT_REPOSITORY } from 'src/content/domain/content.tokens';
import { USER_REPOSITORY } from '../user/domain/user.tokens';
import { ContentModule } from 'src/content/content.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }), ContentModule, UserModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (repo: UserRepository, jwt: JwtService) =>
        new LoginUseCase(
          repo,
          jwt,
          bcrypt.compareSync,
        ),
      inject: [USER_REPOSITORY, JwtService],
    },
    JwtStrategy
  ],
})
export class AuthModule {}
