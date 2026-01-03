import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterUserUseCase } from '../user/application/register-user.use-case';
import { TypeOrmUserRepository } from '../user/infra/typeorm/typeorm-user.repository';
import { UserOrmEntity } from '../user/infra/typeorm/user.orm-entity';
import { UserRepository } from '../user/domain/user.repository';
import { UpdateUserUseCase } from '../user/application/update-user.use-case';
import { DeleteUserUseCase } from '../user/application/delete-user.usecase';
import { ContentRepository } from 'src/content/domain/content.repository';
import { CONTENT_REPOSITORY, STORAGE_PORT } from 'src/content/domain/content.tokens';
import { USER_REPOSITORY } from '../user/domain/user.tokens';
import { ContentModule } from 'src/content/content.module';
import { UserController } from './presentation/user.controller';
import { StoragePort } from 'src/content/domain/storage.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    ContentModule
  ],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (repo: UserRepository) =>
        new RegisterUserUseCase(
          repo,
          (password: string) => bcrypt.hashSync(password, 10),
        ),
      inject: [USER_REPOSITORY],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repo: UserRepository) =>
        new UpdateUserUseCase(
          repo
        ),
      inject: [USER_REPOSITORY],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepository, contentRepository: ContentRepository, storage: StoragePort) =>
        new DeleteUserUseCase(
          userRepository,
          contentRepository,
          storage
        ),
      inject: [USER_REPOSITORY, CONTENT_REPOSITORY, STORAGE_PORT],
    }
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule { }
