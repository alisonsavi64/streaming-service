import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  NotFoundException,
  UseGuards,
  Delete,
  ForbiddenException,
  Patch,
  Body,
  UseInterceptors,
} from '@nestjs/common';

import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

import { ListContentsUseCase } from '../application/list-contents.use-case';
import { GetContentByIdUseCase } from '../application/get-content-by-id.use-case';
import { UploadContentUseCase } from '../application/upload-content.use-case';
import { DeleteContentUseCase } from '../application/delete-content.use-case';
import { UpdateContentUseCase } from '../application/update-content.use-case';

import { ContentNotFoundError } from '../domain/content.errors';
import { JwtAuthGuard } from '../../auth/application/jwt-auth.guard';

@Controller('contents')
export class ContentController {
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
  async list() {
    return this.listContentsUseCase.execute();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.getContentByIdUseCase.execute({ id });
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any) {
    const userId = req.user.userId;
    const parts = req.parts();

    let fileBuffer: Buffer | null = null;
    let filename = '';
    let mimeType = '';
    let title = '';
    let description = '';

    for await (const part of parts) {
      if (part.type === 'file') {
        filename = part.filename;
        mimeType = part.mimetype;
        fileBuffer = await part.toBuffer();
      } else if (part.type === 'field') {
        if (part.fieldname === 'title') title = part.value as string;
        if (part.fieldname === 'description') description = part.value as string;
      }
    }

    if (!fileBuffer) throw new Error('File is required');
    if (!title || !description)
      throw new Error('Title and description are required');

    return this.uploadContentUseCase.execute({
      title,
      description,
      file: fileBuffer,
      filename,
      mimeType,
      userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user.userId;
      return await this.deleteContentUseCase.execute(id, userId);
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('Unauthorized')) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { title?: string; description?: string },
  ) {
    try {
      const userId = req.user.userId;
      return await this.updateContentUseCase.execute(id, userId, body);
    } catch (error) {
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
