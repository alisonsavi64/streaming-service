import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { MessagingModule } from './shared/infra/messaging/messaging.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'streaming',
      password: 'streaming',
      database: 'streaming',
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
    ContentModule,
    MessagingModule,
    UserModule
  ],
})
export class AppModule {}
