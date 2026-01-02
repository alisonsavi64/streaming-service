import { Content } from '../content.entity';
import { ContentStatus } from '../content.status';
import { InvalidContentTitleError } from '../content.errors';

describe('Content entity', () => {
  const validParams = {
    title: 'My Video',
    description: 'Video description',
    userId: 'user-123',
  };

  it('should create a content with valid parameters', () => {
    const content = Content.create(validParams);

    expect(content).toBeInstanceOf(Content);
    expect(content.title).toBe(validParams.title);
    expect(content.description).toBe(validParams.description);
    expect(content.userId).toBe(validParams.userId);
    expect(content.status).toBe(ContentStatus.UPLOADED);
    expect(content.createdAt).toBeInstanceOf(Date);
    expect(content.processedAt).toBeUndefined();
    expect(content.thumbnailUrl).toBeUndefined();
  });

  it('should throw InvalidContentTitleError if title is invalid', () => {
    expect(() =>
      Content.create({ ...validParams, title: '' })
    ).toThrow(InvalidContentTitleError);

    expect(() =>
      Content.create({ ...validParams, title: 'a' })
    ).toThrow(InvalidContentTitleError);
  });

  it('should throw error if userId is missing', () => {
    expect(() =>
      Content.create({ ...validParams, userId: '' })
    ).toThrow('userId is required');
  });

  it('should change status to PROCESSING', () => {
    const content = Content.create(validParams);
    content.markProcessing();
    expect(content.status).toBe(ContentStatus.PROCESSING);
  });

  it('should change status to PROCESSED and set processedAt', () => {
    const content = Content.create(validParams);
    content.markReady();
    expect(content.status).toBe(ContentStatus.PROCESSED);
    expect(content.processedAt).toBeInstanceOf(Date);
  });

  it('should change status to FAILED', () => {
    const content = Content.create(validParams);
    content.markFailed();
    expect(content.status).toBe(ContentStatus.FAILED);
  });

  it('should set thumbnail URL', () => {
    const content = Content.create(validParams);
    const url = '/thumbnails/123/thumb.jpg';
    content.setThumbnail(url);
    expect(content.thumbnailUrl).toBe(url);
  });

  it('should throw error if thumbnail URL is empty', () => {
    const content = Content.create(validParams);
    expect(() => content.setThumbnail('')).toThrow('thumbnail url is required');
  });

  it('should restore a content from parameters', () => {
    const restored = Content.restore({
      id: 'id-123',
      title: 'Title',
      description: 'Desc',
      userId: 'user-123',
      status: ContentStatus.PROCESSED,
      createdAt: new Date(),
      processedAt: new Date(),
      thumbnailUrl: '/thumb.jpg',
    });

    expect(restored.id).toBe('id-123');
    expect(restored.status).toBe(ContentStatus.PROCESSED);
    expect(restored.thumbnailUrl).toBe('/thumb.jpg');
  });
});
