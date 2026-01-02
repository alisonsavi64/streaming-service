import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { MessagingModule } from './shared/infra/messaging/messaging.module';
import { UserModule } from './user/user.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: (process.env.DATABASE_TYPE as any) || 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'streaming',
      password: process.env.DATABASE_PASSWORD || 'streaming',
      database: process.env.DATABASE_NAME || 'streaming',
      autoLoadEntities: true,
      migrations: ['dist/migrations/*.js'], 
      synchronize: false,
      migrationsRun: true
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    AuthModule,
    ContentModule,
    MessagingModule,
    UserModule
  ],
})
export class AppModule {}
