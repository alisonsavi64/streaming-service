import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthController } from './presentation/auth.controller';
import { LoginUseCase } from './application/login.use-case';
import { RegisterUserUseCase } from './application/register-user.use-case';
import { TypeOrmUserRepository } from './infra/typeorm/typeorm-user.repository';
import { UserOrmEntity } from './infra/typeorm/user.orm-entity';
import { UserRepository } from './domain/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: LoginUseCase,
      useFactory: (repo: UserRepository, jwt: JwtService) =>
        new LoginUseCase(
          repo,
          jwt,
          bcrypt.compareSync,
        ),
      inject: ['UserRepository', JwtService],
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (repo: UserRepository) =>
        new RegisterUserUseCase(
          repo,
          (password: string) => bcrypt.hashSync(password, 10),
        ),
      inject: ['UserRepository'],
    },
  ],
})
export class AuthModule {}
