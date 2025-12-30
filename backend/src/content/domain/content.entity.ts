import { randomUUID } from 'crypto';
import {
  InvalidContentLocationError,
  InvalidContentTitleError,
} from './content.errors';

export type ContentType = 'MOVIE' | 'SERIES';

export class Content {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly location: string,
    public readonly createdAt: Date,
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
      new Date(),
    );
  }

  static restore(params: {
    id: string;
    title: string;
    description: string;
    location: string;
    createdAt: Date;
  }): Content {
    return new Content(
      params.id,
      params.title,
      params.description,
      params.location,
      params.createdAt,
    );
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
