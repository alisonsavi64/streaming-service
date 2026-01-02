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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ListUserContentsUseCase } from '../application/list-user-contents.use-case';
import { CreateContentDto, UpdateContentDto, ContentResponseDto } from './content.dto';

@ApiTags('contents')
@Controller('contents')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(
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
    description: 'Retorna uma lista de todos os conteúdos processados disponíveis no sistema.'
  })
  @ApiResponse({ status: 200, description: 'Conteúdos recuperados com sucesso.', type: [ContentResponseDto] })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  async list(@Req() req: any) {
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
  @UseInterceptors(CacheInterceptor)
  @Get('mine')
  @ApiOperation({
    summary: 'Listar conteúdos do usuário',
    description: 'Retorna todos os conteúdos criados pelo usuário atualmente autenticado.'
  })
  @ApiResponse({ status: 200, description: 'Conteúdos recuperados com sucesso.', type: [ContentResponseDto] })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  async mine(@Req() req: any) {
    const userId = req.user.id;
    try {
      const contents = await this.listUserContentsUseCase.execute(userId);
      this.logger.log({ count: contents.length }, 'Contents listed successfully');
      return contents;
    } catch (err) {
      this.logger.error(err, 'Failed to list contents');
      throw err;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter conteúdo por ID',
    description: 'Retorna um conteúdo específico pelo seu ID. Retorna 404 caso o conteúdo não exista.'
  })
  @ApiResponse({ status: 200, description: 'Conteúdo recuperado com sucesso.', type: ContentResponseDto })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  async getById(@Param('id') id: string, @Req() req: any) {
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Enviar novo conteúdo',
    description: 'Faz upload de um novo conteúdo com título, descrição, arquivo de vídeo e miniatura. Acesso apenas para usuários autenticados.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateContentDto })
  @ApiResponse({ status: 201, description: 'Conteúdo enviado com sucesso.', type: ContentResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
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

    if (!videoBuffer) throw new Error('Arquivo de vídeo é obrigatório');
    if (!thumbnailBuffer) throw new Error('Miniatura é obrigatória');
    if (!title || !description) throw new Error('Título e descrição são obrigatórios');

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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar conteúdo por ID',
    description: 'Atualiza título, descrição ou miniatura de um conteúdo pelo ID. Acesso apenas pelo dono do conteúdo.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateContentDto })
  @ApiResponse({ status: 200, description: 'Conteúdo atualizado com sucesso.', type: ContentResponseDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir conteúdo por ID',
    description: 'Exclui um conteúdo pelo ID. Acesso apenas pelo dono do conteúdo. Retorna uma mensagem de sucesso após a exclusão.'
  })
  @ApiResponse({ status: 200, description: 'Conteúdo excluído com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
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
