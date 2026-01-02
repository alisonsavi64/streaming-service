import request from 'supertest';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

describe('ContentController (e2e) via running API', () => {
let jwtCookie: string;
let createdContentId: string;

beforeAll(async () => {
  await request(BASE_URL)
    .post('/user')
    .send({ name: 'Test', email: 'test@example.com', password: '123456' });

  const loginRes = await request(BASE_URL)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: '123456' });

  const setCookieHeader = loginRes.headers['set-cookie'] as unknown as string[];
  if (!setCookieHeader) throw new Error('No set-cookie header in login response');

  jwtCookie = setCookieHeader.find(c => c.startsWith('access_token'))!;
  if (!jwtCookie) throw new Error('access_token cookie not found');

  const createRes = await request(BASE_URL)
    .post('/contents')
    .set('Cookie', jwtCookie)
    .field('title', 'Initial Title')
    .field('description', 'Initial Description')
    .attach('upload', Buffer.from('hello world'), 'test.txt')
    .attach('thumbnail', Buffer.from('thumbnail'), 'thumb.jpg');

  createdContentId = createRes.body.id;
});

  it('/contents (GET)', async () => {
    const res = await request(BASE_URL)
      .get('/contents')
      .set('Cookie', jwtCookie)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/contents/:id (GET)', async () => {
    const res = await request(BASE_URL)
      .get(`/contents/${createdContentId}`)
      .set('Cookie', jwtCookie)
      .expect(200);

    expect(res.body.title).toBe('Initial Title');
  });

  it('/contents/:id (PATCH)', async () => {
    const res = await request(BASE_URL)
      .patch(`/contents/${createdContentId}`)
      .set('Cookie', jwtCookie)
      .field('title', 'Updated Title')
      .expect(200);

    expect(res.body.message).toBe('Content updated successfully');
    expect(res.body.content.title).toBe('Updated Title');
  });

  it('/contents/:id (DELETE)', async () => {
    const res = await request(BASE_URL)
      .delete(`/contents/${createdContentId}`)
      .set('Cookie', jwtCookie)
      .expect(200);

    expect(res.body.message).toBe('Content deleted successfully');
  });
});
