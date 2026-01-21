import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  Logger,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Body,
  Inject
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../../auth/application/jwt-auth.guard';
import { ListContentsUseCase } from '../application/list-contents.use-case';
import { GetContentByIdUseCase } from '../application/get-content-by-id.use-case';
import { UploadContentUseCase } from '../application/upload-content.use-case';
import { DeleteContentUseCase } from '../application/delete-content.use-case';
import { UpdateContentUseCase } from '../application/update-content.use-case';
import { ContentNotFoundError } from '../domain/content.errors';
import { ListUserContentsUseCase } from '../application/list-user-contents.use-case';
import {
  CreateContentDto,
  UpdateContentDto,
  ContentResponseDto,
  ContentMineResponseDto,
} from './content.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { STORAGE_PORT } from '../domain/content.tokens';
import type { StoragePort } from '../domain/storage.port';
import { Readable } from 'node:stream';

@ApiTags('contents')
@Controller('contents')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
    private readonly listContentsUseCase: ListContentsUseCase,
    private readonly getContentByIdUseCase: GetContentByIdUseCase,
    private readonly uploadContentUseCase: UploadContentUseCase,
    private readonly deleteContentUseCase: DeleteContentUseCase,
    private readonly updateContentUseCase: UpdateContentUseCase,
    private readonly listUserContentsUseCase: ListUserContentsUseCase,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('contents_list')
  @CacheTTL(30)
  @Get()
  @ApiOperation({
    summary: 'Listar todos os conteúdos',
    description:
      'Retorna uma lista de todos os conteúdos processados disponíveis no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contents retrieved successfully',
    type: [ContentResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async list(@Req() req: any) {
    try {
      const contents = await this.listContentsUseCase.execute();
      this.logger.log({ count: contents.length }, 'Contents listed successfully');
      return contents;
    } catch (err) {
      this.logger.error(err, 'Failed to list contents');
      throw new InternalServerErrorException('Internal server error while listing contents');
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get('mine')
  @ApiOperation({
    summary: 'Listar conteúdos do usuário',
    description: 'Retorna todos os conteúdos criados pelo usuário atualmente autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contents retrieved successfully',
    type: [ContentMineResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async mine(@Req() req: any) {
    const userId = req.user.id;
    try {
      const contents = await this.listUserContentsUseCase.execute(userId);
      this.logger.log({ count: contents.length }, 'User contents listed successfully');
      return contents;
    } catch (err) {
      this.logger.error(err, 'Failed to list user contents');
      throw new InternalServerErrorException('Internal server error while listing user contents');
    }
  }


  @Get(':id')
  @ApiOperation({
    summary: 'Obter conteúdo por ID',
    description: 'Retorna um conteúdo específico pelo seu ID. Retorna 404 caso não exista.',
  })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully', type: ContentResponseDto })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getById(@Param('id') id: string, @Req() req: any) {
    try {
      const content = await this.getContentByIdUseCase.execute({ id });
      this.logger.log({ contentId: id }, 'Content fetched successfully');
      return content;
    } catch (error) {
      this.logger.error(error, `Failed to fetch content ${id}`);
      if (error instanceof ContentNotFoundError) {
        throw new NotFoundException('Content not found');
      }
      throw new InternalServerErrorException('Internal server error while fetching content');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiConsumes('application/json')
  async createMeta(@Req() req: any, @Body() body: { title: string; description: string }) {
    const userId = req.user.id;
    const { title, description } = body;
    if (!title || !description) throw new BadRequestException('Title and description are required');

    return await this.uploadContentUseCase.execute({ title, description, userId }); 
  }


  @Put(':id/video')
  @ApiConsumes('application/octet-stream')
  async uploadVideo(@Req() req: any, @Param('id') id: string) {
    const filename = req.headers['x-filename'] as string | undefined;
    const mimeType = (req.headers['content-type'] as string) || 'application/octet-stream';
    if (!filename) throw new BadRequestException('Missing x-filename');
    const stream = (req.body ?? req.raw) as Readable;
    await this.storage.uploadRawStream({
      contentId: id,
      stream,     
      filename,
      mimeType,
    });

    return { ok: true };
  }


  @Put(':id/thumbnail')
  @ApiBearerAuth()
  @ApiConsumes('application/octet-stream')
  async uploadThumbnail(@Req() req: any, @Param('id') id: string) {
    const filename = req.headers['x-filename'] as string | undefined;
    const mimeType = (req.headers['content-type'] as string) || 'application/octet-stream';
    if (!filename) throw new BadRequestException('Missing x-filename');

    const url = await this.storage.uploadThumbnailStream({
      contentId: id,
      stream: req.raw,
      filename,
      mimeType,
    });

    return { ok: true, thumbnailUrl: url };
  }


  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar conteúdo por ID',
    description: 'Atualiza título, descrição ou miniatura de um conteúdo pelo ID.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateContentDto })
  @ApiResponse({ status: 200, description: 'Content updated successfully', type: ContentResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async update(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    this.logger.log({ userId, contentId: id }, 'Content update requested');

    const parts = req.parts();
    let thumbnailBuffer: Buffer | null = null;
    let thumbnailFilename = '';
    let thumbnailMimeType = '';
    let bodyData: { title?: string; description?: string } = {};

    try {
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

    } catch (error: any) {
      this.logger.error(error, `Failed to update content ${id}`);
      if (error.message.includes('Unauthorized')) {
        throw new ForbiddenException('You are not allowed to update this content');
      }
      if (error.message.includes('not found')) {
        throw new NotFoundException('Content not found');
      }
      throw new InternalServerErrorException('Internal server error while updating content');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir conteúdo por ID',
    description: 'Exclui um conteúdo pelo ID. Apenas o dono pode deletar.',
  })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async delete(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    this.logger.warn({ userId, contentId: id }, 'Content deletion requested');

    try {
      const result = await this.deleteContentUseCase.execute(id, userId);
      this.logger.warn({ userId, contentId: id }, 'Content deleted successfully');
      return { message: 'Content deleted successfully' };
    } catch (error: any) {
      this.logger.error(error, `Failed to delete content ${id}`);
      if (error instanceof ContentNotFoundError) {
        throw new NotFoundException('Content not found');
      }
      if (error.message.includes('Unauthorized')) {
        throw new ForbiddenException('You are not allowed to delete this content');
      }
      throw new InternalServerErrorException('Internal server error while deleting content');
    }
  }
}
