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
    public readonly userId: string, 
    public processedAt?: Date,
  ) {}

  static create(params: {
    title: string;
    description: string;
    location: string;
    userId: string;
  }): Content {
    Content.validate(params);

    return new Content(
      randomUUID(),
      params.title,
      params.description,
      params.location,
      ContentStatus.UPLOADED,
      new Date(),
      params.userId 
    );
  }

  static restore(params: {
    id: string;
    title: string;
    description: string;
    location: string;
    status: ContentStatus;
    createdAt: Date;
    userId: string; 
    processedAt?: Date;
  }): Content {
    return new Content(
      params.id,
      params.title,
      params.description,
      params.location,
      params.status,
      params.createdAt,
      params.userId,
      params.processedAt,
    );
  }

  private static validate(params: { title: string; location: string; userId: string }) {
    if (!params.title || params.title.trim().length < 2) {
      throw new InvalidContentTitleError();
    }
    if (!params.location) {
      throw new InvalidContentLocationError();
    }
    if (!params.userId) {
      throw new Error('userId is required');
    }
  }
}
