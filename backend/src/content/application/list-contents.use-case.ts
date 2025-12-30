import { ContentRepository } from '../domain/content.repository';

export class ListContentsUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
  ) {}

  async execute() {
    return this.contentRepository.findAll();
  }
}
