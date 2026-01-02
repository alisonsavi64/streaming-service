import { Repository } from "typeorm";
import { ContentStatus } from "../domain/content.status";
import { ContentOrmEntity } from "../infra/typeorm/content.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MarkContentProcessingUseCase {
  constructor(
    @InjectRepository(ContentOrmEntity)
    private readonly repo: Repository<ContentOrmEntity>,
  ) {}

  async execute(contentId: string) {
    const result = await this.repo.update(
      { id: contentId },
      {
        status: ContentStatus.PROCESSING
      },
    )
  }
}
