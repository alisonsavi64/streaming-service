import { InvalidContentTitleError } from './content.errors';
import { ContentStatus } from './content.status';
import { randomUUID } from 'crypto';

export class Content {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly userId: string,
    public status: ContentStatus,
    public readonly createdAt: Date,
    public processedAt?: Date
  ) {}

  static create(params: {
    title: string;
    description: string;
    userId: string;
  }): Content {
    return new Content(
      randomUUID(),
      params.title,
      params.description,
      params.userId,
      ContentStatus.UPLOADED,
      new Date()
    );
  }

  markProcessing() {
    this.status = ContentStatus.PROCESSING;
  }

  markReady() {
    this.status = ContentStatus.PROCESSED;
    this.processedAt = new Date();
  }

  markFailed() {
    this.status = ContentStatus.FAILED;
  }

  static restore(params: {
    id: string;
    title: string;
    description: string;
    userId: string;
    status: ContentStatus;
    createdAt: Date;
    processedAt?: Date;
  }): Content {
    return new Content(
      params.id,
      params.title,
      params.description,
      params.userId,
      params.status,
      params.createdAt,
      params.processedAt,
    );
  }

  private static validate(params: { title: string; userId: string }) {
    if (!params.title || params.title.trim().length < 2) {
      throw new InvalidContentTitleError();
    }
    if (!params.userId) {
      throw new Error('userId is required');
    }
  }
}
