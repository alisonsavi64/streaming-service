import { IncrementContentViewsUseCase } from '../increment-content-views.use-case';
import { Content } from '../../domain/content.entity';
import { ContentRepository } from '../../domain/content.repository';
import { ContentNotFoundError } from '../../domain/content.errors';

describe('IncrementContentViewsUseCase', () => {
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
    incrementViews: jest.fn(),
  });

  it('should increment views when content exists', async () => {
    const repository = buildRepository();
    repository.findById.mockResolvedValue(
      Content.restore({
        id: 'id-1',
        title: 'Video',
        description: 'desc',
        userId: 'user-1',
        status: 'PROCESSED' as any,
        createdAt: new Date(),
      }),
    );
    const useCase = new IncrementContentViewsUseCase(repository);

    await useCase.execute('id-1');

    expect(repository.incrementViews).toHaveBeenCalledWith('id-1');
  });

  it('should throw ContentNotFoundError when content does not exist', async () => {
    const repository = buildRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new IncrementContentViewsUseCase(repository);

    await expect(useCase.execute('missing-id')).rejects.toThrow(ContentNotFoundError);
    expect(repository.incrementViews).not.toHaveBeenCalled();
  });
});
