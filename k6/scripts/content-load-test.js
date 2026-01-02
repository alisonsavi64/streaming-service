import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: Number(__ENV.K6_VUS) || 10,
  duration: __ENV.K6_DURATION || '30s',
};
const BASE_URL = __ENV.BACKEND_URL || 'http://backend:3001';

export default function () {
  const email = `test${Math.floor(Math.random() * 100000)}@example.com`;
  const emailUpdate = `test${Math.floor(Math.random() * 100000)}@example.com`;
  const registerRes = http.post(`${BASE_URL}/user`, JSON.stringify({
    name: email,
    email: email,
    password: '123456',
  }), { headers: { 'Content-Type': 'application/json' } });
  check(registerRes, {
    'registered successfully (201 or 409)': (r) => r.status === 201 || r.status === 409,
  });
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: email,
    password: '123456',
  }), { headers: { 'Content-Type': 'application/json' } });
  check(loginRes, { 'login success': (r) => r.status === 200 || r.status === 201 });
  const setCookieHeader = loginRes.headers['Set-Cookie'] || loginRes.headers['set-cookie'];
  if (!setCookieHeader) throw new Error('No set-cookie header in login response');
  const cookies = setCookieHeader.split(';').map(c => c.trim());
  const accessTokenCookie = cookies.find(c => c.startsWith('access_token'));
  if (!accessTokenCookie) throw new Error('access_token cookie not found');
  const cookieHeader = { headers: { Cookie: accessTokenCookie } };
  const fakeMp4 = new Uint8Array(1);
  const fakePng = new Uint8Array(1);
  const formData = {
    title: 'Load Test Video',
    description: 'Load testing content',
    upload: http.file(fakeMp4, 'test.mp4', 'video/mp4'),
    thumbnail: http.file(fakePng, 'thumb.png', 'image/png'),
  };
  const createRes = http.post(`${BASE_URL}/contents`, formData, cookieHeader);
  check(createRes, { 'content created': (r) => r.status === 201 });
  const contentId = createRes.json('id');
  const patchFormData = {
    title: 'Updated Load Test',
    thumbnail: http.file(fakePng, 'thumb.png', 'image/png')
  };
  const patchRes = http.patch(`${BASE_URL}/contents/${contentId}`, patchFormData, {
    headers: { Cookie: accessTokenCookie },
  });
  check(patchRes, { 'PATCH status 200': (r) => r.status === 200 });
  const delRes = http.del(`${BASE_URL}/contents/${contentId}`, null, cookieHeader);
  check(delRes, { 'DELETE status 200 or 404': (r) => r.status === 200 || r.status === 404 });
  const updateUserRes = http.put(`${BASE_URL}/user`, JSON.stringify({
    name: 'Updated User',
    email: emailUpdate,
    password: '654321',
  }), { headers: { 'Content-Type': 'application/json', Cookie: accessTokenCookie } });
  check(updateUserRes, { 'update user success': (r) => r.status === 200 });
  const deleteUserRes = http.del(`${BASE_URL}/user`, null, cookieHeader);
  check(deleteUserRes, { 'delete user success': (r) => r.status === 200 });
  sleep(1);
}
