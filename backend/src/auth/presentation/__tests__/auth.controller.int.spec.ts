import request from 'supertest';
import { randomUUID } from 'crypto';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

describe('AuthController (e2e) via running API', () => {
  const randomEmail = `test-${randomUUID()}@example.com`;
  const testUser = { name: 'Test User', email: randomEmail, password: '123456' };
  let jwtCookie: string;

  beforeAll(async () => {
    await request(BASE_URL)
      .post('/user')
      .send(testUser)
      .expect(201);
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(201);

    const setCookieHeader = loginRes.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    jwtCookie = setCookieHeader[0].split(';')[0]; 
  });

  it('POST /auth/login - invalid credentials', async () => {
    const res = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' })
      .expect(401);

    expect(res.body.message).toContain('Invalid credentials');
  });

  it('GET /auth/me - should return logged in user', async () => {
    const res = await request(BASE_URL)
      .get('/auth/me')
      .set('Cookie', jwtCookie)
      .expect(200);

    expect(res.body.email).toBe(testUser.email);
  });

  it('POST /auth/logout - should clear cookie', async () => {
    const res = await request(BASE_URL)
      .post('/auth/logout')
      .set('Cookie', jwtCookie)
      .expect(201);

    expect(res.body.success).toBe(true);
  });
});
