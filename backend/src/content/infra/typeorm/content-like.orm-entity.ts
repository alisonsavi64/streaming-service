import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ContentOrmEntity } from './content.orm-entity';
import { UserOrmEntity } from '../../../user/infra/typeorm/user.orm-entity';

@Entity('content_likes')
@Unique(['contentId', 'userId'])
export class ContentLikeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contentId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ContentOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId', referencedColumnName: 'id' })
  content: ContentOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserOrmEntity;
}
