import { DataSource } from 'typeorm';
import { UserOrmEntity } from './user/infra/typeorm/user.orm-entity';
import { ContentOrmEntity } from './content/infra/typeorm/content.orm-entity';

export const AppDataSource = new DataSource({
  type: (process.env.DATABASE_TYPE as any) || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'streaming',
  password: process.env.DATABASE_PASSWORD || 'streaming',
  database: process.env.DATABASE_NAME || 'streaming',
  entities: [UserOrmEntity, ContentOrmEntity],
  migrations: ['src/migrations/*.ts'],
});
