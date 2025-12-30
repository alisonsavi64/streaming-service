import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContentRepository } from '../../domain/content.repository';
import { Content } from '../../domain/content.entity';
import { ContentOrmEntity } from './content.orm-entity';

export class TypeOrmContentRepository implements ContentRepository {
    constructor(
        @InjectRepository(ContentOrmEntity)
        private readonly repository: Repository<ContentOrmEntity>,
    ) { }

    async findAll(): Promise<Content[]> {
        const rows = await this.repository.find();
        return rows.map(
            row =>
                Content.restore({
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    location: row.location,
                    createdAt: row.createdAt
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
            location: row.location,
            createdAt: row.createdAt,
        })
    }

    async save(content: Content): Promise<void> {
        const ormEntity = this.repository.create({
            id: content.id,
            title: content.title,
            description: content.description,
            location: content.location,
            createdAt: content.createdAt,
        });
        await this.repository.save(ormEntity);
    }
}
