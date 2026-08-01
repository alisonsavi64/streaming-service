import { ListContentsUseCase } from '../list-contents.use-case';
import { Content } from '../../domain/content.entity';
import { ContentRepository } from '../../domain/content.repository';
import { ContentLikeRepository } from '../../domain/content-like.repository';

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
    incrementViews: jest.fn(),
  });

  const buildLikeRepository = (): jest.Mocked<ContentLikeRepository> => ({
    like: jest.fn(),
    unlike: jest.fn(),
    isLikedByUser: jest.fn(),
    countByContentId: jest.fn(),
    countByContentIds: jest.fn().mockResolvedValue({}),
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
    const likeRepository = buildLikeRepository();
    repository.findAll.mockResolvedValue([buildContent('Video 1')]);
    const useCase = new ListContentsUseCase(repository, likeRepository);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.search).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Video 1');
    expect(result[0].likesCount).toBe(0);
  });

  it('should call search when a search term is provided', async () => {
    const repository = buildRepository();
    const likeRepository = buildLikeRepository();
    repository.search.mockResolvedValue([buildContent('Dragons documentary')]);
    const useCase = new ListContentsUseCase(repository, likeRepository);

    const result = await useCase.execute('dragons');

    expect(repository.search).toHaveBeenCalledWith('dragons');
    expect(repository.findAll).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Dragons documentary');
  });

  it('should include the likes count for each content', async () => {
    const repository = buildRepository();
    const likeRepository = buildLikeRepository();
    repository.findAll.mockResolvedValue([buildContent('Video 1')]);
    likeRepository.countByContentIds.mockResolvedValue({ 'id-1': 5 });
    const useCase = new ListContentsUseCase(repository, likeRepository);

    const result = await useCase.execute();

    expect(result[0].likesCount).toBe(5);
  });
});
