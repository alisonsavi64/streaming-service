import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { ContentRepository } from '../../domain/content.repository';
import { Content } from '../../domain/content.entity';
import { ContentOrmEntity } from './content.orm-entity';
import { ContentStatus } from '../../../content/domain/content.status';

export class TypeOrmContentRepository implements ContentRepository {
    constructor(
        @InjectRepository(ContentOrmEntity)
        private readonly repository: Repository<ContentOrmEntity>,
    ) { }

    async findAll(): Promise<Content[]> {
        const rows = await this.repository.find({
            where: { status: ContentStatus.PROCESSED },
        });
        return rows.map(row =>
            Content.restore({
                id: row.id,
                title: row.title,
                description: row.description,
                status: row.status,
                thumbnailUrl: row.thumbnailUrl,
                createdAt: row.createdAt,
                userId: row.userId,
            }),
        );
    }

    async findStuckVideos(statuses: ContentStatus[]): Promise<Content[]> {
        const rows = await this.repository
            .createQueryBuilder('content')
            .where('content.status IN (:...statuses)', { statuses })
            .andWhere("EXTRACT(EPOCH FROM (NOW() - content.createdAt)) > :seconds", { seconds: 10 * 60 })
            .getMany();
        return rows.map(row =>
            Content.restore({
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            thumbnailUrl: row.thumbnailUrl,
            createdAt: row.createdAt,
            userId: row.userId,
            })
        );
    }



    async findAllByUserId(userId: string): Promise<Content[]> {
        const rows = await this.repository.find({
            where: { userId },
        });
        return rows.map(row =>
            Content.restore({
                id: row.id,
                title: row.title,
                description: row.description,
                status: row.status,
                thumbnailUrl: row.thumbnailUrl,
                createdAt: row.createdAt,
                userId: row.userId,
            }),
        );
    }

    async findById(id: string): Promise<Content | null> {
        const row = await this.repository.findOne({ where: { id } });
        if (!row) return null;
        return Content.restore({
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            thumbnailUrl: row.thumbnailUrl,
            createdAt: row.createdAt,
            userId: row.userId,
        });
    }

    async findByUserId(userId: string): Promise<Content[]> {
        const rows = await this.repository.find({ where: { userId } });
        return rows.map(row =>
            Content.restore({
                id: row.id,
                title: row.title,
                description: row.description,
                status: row.status,
                thumbnailUrl: row.thumbnailUrl,
                createdAt: row.createdAt,
                userId: row.userId,
            }),
        );
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.repository.delete({ userId });
    }

    async save(content: Content): Promise<void> {
        const ormEntity = this.repository.create({
            id: content.id,
            title: content.title,
            description: content.description,
            userId: content.userId,
            thumbnailUrl: content.thumbnailUrl,
            createdAt: content.createdAt,
        });
        await this.repository.save(ormEntity);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async update(id: string, fields: Partial<{ title: string; description: string }>): Promise<void> {
        await this.repository.update(id, fields);
    }
}
