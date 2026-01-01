import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../../auth/application/jwt-auth.guard';
import { ListContentsUseCase } from '../application/list-contents.use-case';
import { GetContentByIdUseCase } from '../application/get-content-by-id.use-case';
import { UploadContentUseCase } from '../application/upload-content.use-case';
import { DeleteContentUseCase } from '../application/delete-content.use-case';
import { UpdateContentUseCase } from '../application/update-content.use-case';
import { ContentNotFoundError } from '../domain/content.errors';

@Controller('contents')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(
    private readonly listContentsUseCase: ListContentsUseCase,
    private readonly getContentByIdUseCase: GetContentByIdUseCase,
    private readonly uploadContentUseCase: UploadContentUseCase,
    private readonly deleteContentUseCase: DeleteContentUseCase,
    private readonly updateContentUseCase: UpdateContentUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('contents_list')
  @CacheTTL(30)
  @Get()
  async list(@Req() req: any) {
    this.logger.log({ userId: req.user.id }, 'Listing contents');
    try {
      const contents = await this.listContentsUseCase.execute();
      this.logger.log({ count: contents.length }, 'Contents listed successfully');
      return contents;
    } catch (err) {
      this.logger.error(err, 'Failed to list contents');
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: any) {
    this.logger.log({ userId: req.user.id, contentId: id }, 'Fetching content by ID');
    try {
      const content = await this.getContentByIdUseCase.execute({ id });
      this.logger.log({ contentId: id }, 'Content fetched successfully');
      return content;
    } catch (error) {
      this.logger.error(error, `Failed to fetch content ${id}`);
      if (error instanceof ContentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any) {
    const userId = req.user.id;
    this.logger.log({ userId }, 'Upload content requested');

    const parts = req.parts();

    let videoBuffer: Buffer | null = null;
    let videoFilename = '';
    let videoMimeType = '';

    let thumbnailBuffer: Buffer | null = null;
    let thumbnailFilename = '';
    let thumbnailMimeType = '';

    let title = '';
    let description = '';

    for await (const part of parts) {
      if (part.type === 'file') {
        if (part.fieldname === 'upload') {
          videoFilename = part.filename;
          videoMimeType = part.mimetype;
          videoBuffer = await part.toBuffer();
        }
        if (part.fieldname === 'thumbnail') {
          thumbnailFilename = part.filename;
          thumbnailMimeType = part.mimetype;
          thumbnailBuffer = await part.toBuffer();
        }
      }
      if (part.type === 'field') {
        if (part.fieldname === 'title') title = part.value as string;
        if (part.fieldname === 'description') description = part.value as string;
      }
    }

    if (!videoBuffer) throw new Error('Video file is required');
    if (!thumbnailBuffer) throw new Error('Thumbnail is required');
    if (!title || !description) throw new Error('Title and description are required');

    try {
      const content = await this.uploadContentUseCase.execute({
        title,
        description,
        video: { buffer: videoBuffer, filename: videoFilename, mimeType: videoMimeType },
        thumbnail: { buffer: thumbnailBuffer, filename: thumbnailFilename, mimeType: thumbnailMimeType },
        userId,
      });
      this.logger.log({ userId, contentId: content.id }, 'Content uploaded successfully');
      return content;
    } catch (err) {
      this.logger.error(err, 'Failed to upload content');
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    this.logger.log({ userId, contentId: id }, 'Update content requested');

    const parts = req.parts();
    let thumbnailBuffer: Buffer | null = null;
    let thumbnailFilename = '';
    let thumbnailMimeType = '';
    let bodyData: { title?: string; description?: string } = {};

    for await (const part of parts) {
      if (part.fieldname === 'thumbnail') {
        thumbnailBuffer = await part.toBuffer();
        thumbnailFilename = part.filename;
        thumbnailMimeType = part.mimetype;
      } else if (part.type === 'field') {
        if (part.fieldname === 'title') bodyData.title = part.value as string;
        if (part.fieldname === 'description') bodyData.description = part.value as string;
      }
    }

    try {
      const content = await this.updateContentUseCase.execute(
        id,
        userId,
        bodyData,
        thumbnailBuffer
          ? { buffer: thumbnailBuffer, filename: thumbnailFilename, mimeType: thumbnailMimeType }
          : null,
      );
      this.logger.log({ userId, contentId: id }, 'Content updated successfully');
      return content;
    } catch (error) {
      this.logger.error(error, `Failed to update content ${id}`);
      if (error.message.includes('Unauthorized')) {
        throw new ForbiddenException(error.message);
      }
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    this.logger.warn({ userId, contentId: id }, 'Content deletion requested');

    try {
      const result = await this.deleteContentUseCase.execute(id, userId);
      this.logger.warn({ userId, contentId: id }, 'Content deleted successfully');
      return result;
    } catch (error) {
      this.logger.error(error, `Failed to delete content ${id}`);
      if (error instanceof ContentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('Unauthorized')) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
