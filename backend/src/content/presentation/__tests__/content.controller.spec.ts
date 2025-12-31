import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from '../content.controller';
import { ListContentsUseCase } from '../../application/list-contents.use-case';
import { GetContentByIdUseCase } from '../../application/get-content-by-id.use-case';
import { UploadContentUseCase } from '../../application/upload-content.use-case';
import { DeleteContentUseCase } from '../../application/delete-content.use-case';
import { UpdateContentUseCase } from '../../application/update-content.use-case';
import { MarkContentProcessedUseCase } from '../../application/mark-content-processed.use-case';
import { ContentNotFoundError } from '../../domain/content.errors';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ContentController', () => {
  let controller: ContentController;
  let listUseCase: any;
  let getByIdUseCase: any;
  let uploadUseCase: any;
  let deleteUseCase: any;
  let updateUseCase: any;
  let markProcessedUseCase: any;

  beforeEach(async () => {
    listUseCase = { execute: jest.fn() };
    getByIdUseCase = { execute: jest.fn() };
    uploadUseCase = { execute: jest.fn() };
    deleteUseCase = { execute: jest.fn() };
    updateUseCase = { execute: jest.fn() };
    markProcessedUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [
        { provide: ListContentsUseCase, useValue: listUseCase },
        { provide: GetContentByIdUseCase, useValue: getByIdUseCase },
        { provide: UploadContentUseCase, useValue: uploadUseCase },
        { provide: DeleteContentUseCase, useValue: deleteUseCase },
        { provide: UpdateContentUseCase, useValue: updateUseCase },
        { provide: MarkContentProcessedUseCase, useValue: markProcessedUseCase },
      ],
    }).compile();

    controller = module.get<ContentController>(ContentController);
  });

  it('should list contents', async () => {
    listUseCase.execute.mockResolvedValue(['content1', 'content2']);
    const result = await controller.list();
    expect(result).toEqual(['content1', 'content2']);
  });

  it('should get content by id', async () => {
    getByIdUseCase.execute.mockResolvedValue({ id: '1', title: 'title' });
    const result = await controller.getById('1');
    expect(result).toEqual({ id: '1', title: 'title' });
  });

  it('should throw NotFoundException if content not found', async () => {
    getByIdUseCase.execute.mockRejectedValue(new ContentNotFoundError('not found'));
    await expect(controller.getById('1')).rejects.toThrow(NotFoundException);
  });

  it('should create content', async () => {
    const req: any = {
      user: { userId: 'user1' },
      parts: jest.fn().mockReturnValue(
        (async function* () {
          yield { type: 'file', filename: 'file.mp4', mimetype: 'video/mp4', toBuffer: async () => Buffer.from('') };
          yield { type: 'field', fieldname: 'title', value: 'My Title' };
          yield { type: 'field', fieldname: 'description', value: 'My Desc' };
        })(),
      ),
    };

    uploadUseCase.execute.mockResolvedValue({ id: '1', title: 'My Title' });
    const result = await controller.create(req);
    expect(result).toEqual({ id: '1', title: 'My Title' });
  });

  it('should delete content successfully', async () => {
    const req: any = { user: { userId: 'user1' } };
    deleteUseCase.execute.mockResolvedValue({ message: 'Content deleted successfully' });
    const result = await controller.delete('1', req);
    expect(result).toEqual({ message: 'Content deleted successfully' });
  });

  it('should throw NotFoundException when deleting non-existent content', async () => {
    const req: any = { user: { userId: 'user1' } };
    deleteUseCase.execute.mockRejectedValue(new ContentNotFoundError('not found'));
    await expect(controller.delete('1', req)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when user not owner', async () => {
    const req: any = { user: { userId: 'user1' } };
    deleteUseCase.execute.mockRejectedValue(new Error('Unauthorized'));
    await expect(controller.delete('1', req)).rejects.toThrow(ForbiddenException);
  });

  it('should update content successfully', async () => {
    const req: any = { user: { userId: 'user1' } };
    const body = { title: 'New Title', description: 'New Desc' };
    updateUseCase.execute.mockResolvedValue({ message: 'Content updated successfully' });
    const result = await controller.update('1', req, body);
    expect(result).toEqual({ message: 'Content updated successfully' });
  });

  it('should throw NotFoundException when updating non-existent content', async () => {
    const req: any = { user: { userId: 'user1' } };
    const body = { title: 'New Title' };
    updateUseCase.execute.mockRejectedValue(new ContentNotFoundError('not found'));
    await expect(controller.update('1', req, body)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when updating content of another user', async () => {
    const req: any = { user: { userId: 'user1' } };
    const body = { title: 'New Title' };
    updateUseCase.execute.mockRejectedValue(new Error('Unauthorized'));
    await expect(controller.update('1', req, body)).rejects.toThrow(ForbiddenException);
  });
});
