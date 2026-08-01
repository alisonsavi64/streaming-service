import { ListContentsUseCase } from '../list-contents.use-case';
import { Content } from '../../domain/content.entity';
import { ContentRepository } from '../../domain/content.repository';

describe('ListContentsUseCase', () => {
  const buildRepository = (): jest.Mocked<ContentRepository> => ({
    findAll: jest.fn(),
    findAllByUserId: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    deleteByUserId: jest.fn(),
    update: jest.fn(),
    findStuckVideos: jest.fn(),
    search: jest.fn(),
  });

  const buildContent = (title: string) =>
    Content.restore({
      id: 'id-1',
      title,
      description: 'desc',
      userId: 'user-1',
      status: 'PROCESSED' as any,
      createdAt: new Date(),
    });

  it('should call findAll when no search term is provided', async () => {
    const repository = buildRepository();
    repository.findAll.mockResolvedValue([buildContent('Video 1')]);
    const useCase = new ListContentsUseCase(repository);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.search).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Video 1');
  });

  it('should call search when a search term is provided', async () => {
    const repository = buildRepository();
    repository.search.mockResolvedValue([buildContent('Dragons documentary')]);
    const useCase = new ListContentsUseCase(repository);

    const result = await useCase.execute('dragons');

    expect(repository.search).toHaveBeenCalledWith('dragons');
    expect(repository.findAll).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Dragons documentary');
  });
});
