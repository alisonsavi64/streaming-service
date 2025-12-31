import request from 'supertest';

const BASE_URL = 'http://localhost:3001';

describe('UserController (e2e) via running API', () => {
  let jwtToken: string;

  const testUser = {
    name: 'Test User',
    email: 'user-test@example.com',
    password: '123456',
  };

  beforeAll(async () => {
    await request(BASE_URL)
      .post('/user')
      .send(testUser);
    const loginRes = await request(BASE_URL)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    jwtToken = loginRes.body.access_token;
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
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Updated Name', email: testUser.email, password: 'newpass' })
      .expect(200);

    expect(res.status).toBe(200);
  });

  it('PUT /user - should fail without JWT', async () => {
    await request(BASE_URL)
      .put('/user')
      .send({ name: 'Hacker' })
      .expect(401);
  });

  it('DELETE /user - should delete user', async () => {
    const res = await request(BASE_URL)
      .delete('/user')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.message).toBe('User and all contents deleted');
  });
});
