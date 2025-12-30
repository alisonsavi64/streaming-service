import {
    Controller,
    Get,
    Post,
    Param,
    Req,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ListContentsUseCase } from '../application/list-contents.use-case';
import { GetContentByIdUseCase } from '../application/get-content-by-id.use-case';
import { UploadContentUseCase } from '../application/upload-content.use-case';
import { ContentNotFoundError } from '../domain/content.errors';
import { JwtAuthGuard } from 'src/auth/application/jwt-auth.guard';

@Controller('contents')
export class ContentController {
    constructor(
        private readonly listContentsUseCase: ListContentsUseCase,
        private readonly getContentByIdUseCase: GetContentByIdUseCase,
        private readonly uploadContentUseCase: UploadContentUseCase,
    ) { }

    @UseGuards(JwtAuthGuard)
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

    // @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Req() req: FastifyRequest) {
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
          if (part.fieldname === 'title') {
            title = part.value as string;
          }
          if (part.fieldname === 'description') {
            description = part.value as string;
          }
        }
      }
      if (!fileBuffer) {
        throw new Error('File is required');
      }
      if (!title || !description) {
        throw new Error('Title and description are required');
      }
      return this.uploadContentUseCase.execute({
        title,
        description,
        file: fileBuffer,
        filename,
        mimeType,
      });
    }

}
