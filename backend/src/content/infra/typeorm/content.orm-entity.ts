import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContentStatus } from '../../domain/content.status';
import { UserOrmEntity } from '../../../user/infra/typeorm/user.orm-entity';

@Entity('contents')
export class ContentOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.UPLOADED,
  })
  status: ContentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  processedAt?: Date;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserOrmEntity;
}
