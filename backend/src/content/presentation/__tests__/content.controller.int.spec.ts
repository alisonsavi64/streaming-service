import request from 'supertest';

const BASE_URL = 'http://localhost:3001';

describe('ContentController (e2e) via running API', () => {
  let jwtToken: string;
  let createdContentId: number;

  beforeAll(async () => {
    await request(BASE_URL)
      .post('/user')
      .send({ name: 'Test', email: 'test@example.com', password: '123456' });

    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '123456' });

    jwtToken = loginRes.body.access_token;

    const createRes = await request(BASE_URL)
      .post('/contents')
      .set('Authorization', `Bearer ${jwtToken}`)
      .field('title', 'Initial Title')
      .field('description', 'Initial Description')
      .attach('file', Buffer.from('hello world'), 'test.txt');

    createdContentId = createRes.body.id;
  });

  it('/contents (GET)', async () => {
    const res = await request(BASE_URL)
      .get('/contents')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/contents/:id (GET)', async () => {
    const res = await request(BASE_URL)
      .get(`/contents/${createdContentId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.title).toBe('Initial Title');
  });

  it('/contents/:id (PATCH)', async () => {
    const res = await request(BASE_URL)
      .patch(`/contents/${createdContentId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Updated Title' })
      .expect(200);

    expect(res.body.message).toBe('Content updated successfully');
  });

  it('/contents/:id (DELETE)', async () => {
    const res = await request(BASE_URL)
      .delete(`/contents/${createdContentId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.message).toBe('Content deleted successfully');
  });
});
