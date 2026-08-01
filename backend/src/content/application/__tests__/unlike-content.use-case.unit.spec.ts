import { UnlikeContentUseCase } from '../unlike-content.use-case';
import { Content } from '../../domain/content.entity';
import { ContentRepository } from '../../domain/content.repository';
import { ContentLikeRepository } from '../../domain/content-like.repository';
import { ContentNotFoundError } from '../../domain/content.errors';

describe('UnlikeContentUseCase', () => {
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

  const buildLikeRepository = (): jest.Mocked<ContentLikeRepository> => ({
    like: jest.fn(),
    unlike: jest.fn(),
    isLikedByUser: jest.fn(),
    countByContentId: jest.fn(),
    countByContentIds: jest.fn(),
  });

  it('should unlike content that exists', async () => {
    const repository = buildRepository();
    const likeRepository = buildLikeRepository();
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
    likeRepository.countByContentId.mockResolvedValue(2);
    const useCase = new UnlikeContentUseCase(repository, likeRepository);

    const result = await useCase.execute('id-1', 'user-2');

    expect(likeRepository.unlike).toHaveBeenCalledWith('id-1', 'user-2');
    expect(result).toEqual({ liked: false, likesCount: 2 });
  });

  it('should throw ContentNotFoundError when content does not exist', async () => {
    const repository = buildRepository();
    const likeRepository = buildLikeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new UnlikeContentUseCase(repository, likeRepository);

    await expect(useCase.execute('missing-id', 'user-2')).rejects.toThrow(ContentNotFoundError);
    expect(likeRepository.unlike).not.toHaveBeenCalled();
  });
});
