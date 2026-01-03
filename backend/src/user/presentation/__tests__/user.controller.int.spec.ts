import request from 'supertest';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

describe('UserController (e2e) via running API', () => {
  let jwtCookie: string;

  const randomEmail = `user-${Math.random().toString(36).substring(2, 8)}@example.com`;

  const testUser = {
    name: 'Test User',
    email: randomEmail,
    password: '123456',
  };

  beforeAll(async () => {
    await request(BASE_URL)
      .post('/user')
      .send(testUser);

    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const setCookieHeader = loginRes.headers['set-cookie'] as unknown as string[];
    if (!setCookieHeader) throw new Error('No set-cookie header in login response');

    jwtCookie = setCookieHeader.find(c => c.startsWith('access_token'))!;
    if (!jwtCookie) throw new Error('access_token cookie not found');
  });

  it('POST /user - should not register existing user', async () => {
    const res = await request(BASE_URL)
      .post('/user')
      .send(testUser)
      .expect(409);

    expect(res.body.message).toBeDefined();
  });

  it('PUT /user - should update user', async () => {
    const res = await request(BASE_URL)
      .put('/user')
      .set('Cookie', jwtCookie)
      .send({ name: 'Updated Name', email: testUser.email, password: 'newpass' })
      .expect(200);

    expect(res.status).toBe(200);
  });

  it('PUT /user - should fail without cookie', async () => {
    await request(BASE_URL)
      .put('/user')
      .send({ name: 'Hacker' })
      .expect(401);
  });

  it('DELETE /user - should delete user', async () => {
    const res = await request(BASE_URL)
      .delete('/user')
      .set('Cookie', jwtCookie)
      .expect(200);

    expect(res.body.message).toBe('Usuário e todos os conteúdos deletados');
  });
});
