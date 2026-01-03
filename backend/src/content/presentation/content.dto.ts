import { ApiProperty } from '@nestjs/swagger';
import { ContentStatus } from '../domain/content.status';

export class FileDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Video file (.mov, .mkv or any video/* type)' })
  buffer: Buffer;

  @ApiProperty({ description: 'Filename' })
  filename: string;

  @ApiProperty({ description: 'MIME type' })
  mimeType: string;
}

export class CreateContentDto {
  @ApiProperty({ description: 'Title of the content' })
  title: string;

  @ApiProperty({ description: 'Description of the content' })
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Video file' })
  upload: any;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Thumbnail image' })
  thumbnail: any;
}

export class UpdateContentDto {
  @ApiProperty({ description: 'Title of the content', required: false })
  title?: string;

  @ApiProperty({ description: 'Description of the content', required: false })
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Thumbnail image', required: false })
  thumbnail?: any;
}

export class ContentResponseDto {
  @ApiProperty({ description: 'Content ID' })
  id: string;

  @ApiProperty({ description: 'Title of the content' })
  title: string;

  @ApiProperty({ description: 'Description of the content' })
  description: string;

  @ApiProperty({ description: 'Owner user ID' })
  userId: string;

  @ApiProperty({ description: 'Video URL or path' })
  videoUrl: string;

  @ApiProperty({ description: 'Thumbnail URL or path' })
  thumbnailUrl: string;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;
}

export class ContentMineResponseDto {
  @ApiProperty({ description: 'Content ID' })
  id: string;

  @ApiProperty({ description: 'Content title' })
  title: string;

  @ApiProperty({ description: 'Content description' })
  description: string;

  @ApiProperty({ description: 'ID of the user who owns the content' })
  userId: string;

  @ApiProperty({ description: 'Video URL or path' })
  videoUrl: string;

  @ApiProperty({ description: 'Thumbnail URL or path' })
  thumbnailUrl: string;

  @ApiProperty({ description: 'Content creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Content last update date' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Content status',
    enum: ContentStatus,
  })
  status: ContentStatus;
}
