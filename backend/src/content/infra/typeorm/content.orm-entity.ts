import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ContentStatus } from '../../domain/content.status';

@Entity('contents')
export class ContentOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

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
}
