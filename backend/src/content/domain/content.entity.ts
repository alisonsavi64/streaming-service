import { randomUUID } from 'crypto';
import {
  InvalidContentLocationError,
  InvalidContentTitleError,
} from './content.errors';
import { ContentStatus } from './content.status';

export class Content {
  private constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public location: string,
    public status: ContentStatus,
    public readonly createdAt: Date,
    public processedAt?: Date,
  ) {}

  static create(params: {
    title: string;
    description: string;
    location: string;
  }): Content {
    Content.validate(params);

    return new Content(
      randomUUID(),
      params.title,
      params.description,
      params.location,
      ContentStatus.UPLOADED,
      new Date(),
    );
  }

  static restore(params: {
    id: string;
    title: string;
    description: string;
    location: string;
    status: ContentStatus;
    createdAt: Date;
    processedAt?: Date;
  }): Content {
    return new Content(
      params.id,
      params.title,
      params.description,
      params.location,
      params.status,
      params.createdAt,
      params.processedAt,
    );
  }

  markProcessing() {
    if (this.status !== ContentStatus.UPLOADED) return;
    this.status = ContentStatus.PROCESSING;
  }

  markProcessed(processedLocation: string) {
    this.status = ContentStatus.PROCESSED;
    this.location = processedLocation;
    this.processedAt = new Date();
  }

  markFailed() {
    this.status = ContentStatus.FAILED;
  }

  private static validate(params: {
    title: string;
    location: string;
  }) {
    if (!params.title || params.title.trim().length < 2) {
      throw new InvalidContentTitleError();
    }
    if (!params.location) {
      throw new InvalidContentLocationError();
    }
  }
}
