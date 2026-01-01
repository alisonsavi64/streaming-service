import { DataSource } from 'typeorm';
import { UserOrmEntity } from './user/infra/typeorm/user.orm-entity';
import { ContentOrmEntity } from './content/infra/typeorm/content.orm-entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'streaming',
  password: 'streaming',
  database: 'streaming',
  entities: [UserOrmEntity, ContentOrmEntity],
  migrations: ['src/migrations/*.ts'],
});
