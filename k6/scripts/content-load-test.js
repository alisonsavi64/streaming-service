import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'http://backend:3001';

export default function () {
  const email = `test${Math.floor(Math.random() * 100000)}@example.com`;
  const emailUpdate = `test${Math.floor(Math.random() * 100000)}@example.com`;
  const registerRes = http.post(`${BASE_URL}/user`, JSON.stringify({
    name: email,
    email: email,
    password: '123456',
  }), { headers: { 'Content-Type': 'application/json' } });
  check(registerRes, {
    'registered successfully (201 or 409)': (r) => r.status === 201,
  });
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: email,
    password: '123456',
  }), { headers: { 'Content-Type': 'application/json' } });
  check(loginRes, { 'login success': (r) => r.status === 201 || r.status === 200 });
  const token = loginRes.json('access_token');
  const fakeMp4 = new Uint8Array(1);
  const formData = {
    title: 'Load Test Video',
    description: 'Load testing content',
    upload: http.file(fakeMp4, 'test.mp4', 'video/mp4'),
  };
  const createRes = http.post(`${BASE_URL}/contents`, formData, { headers: { Authorization: `Bearer ${token}` } });
  check(createRes, { 'content created': (r) => r.status === 201 });
  const contentId = createRes.json('id');
  const patchRes = http.patch(`${BASE_URL}/contents/${contentId}`, JSON.stringify({ title: 'Updated Load Test' }), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  check(patchRes, { 'PATCH status 200': (r) => r.status === 200 });

  const delRes = http.del(`${BASE_URL}/contents/${contentId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(delRes, { 'DELETE status 200 or 404': (r) => r.status === 200 });
  const updateUserRes = http.put(`${BASE_URL}/user`, JSON.stringify({
    name: 'Updated User',
    email: emailUpdate, 
    password: '654321',
  }), { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
  check(updateUserRes, { 'update user success': (r) => r.status === 200 });
  const deleteUserRes = http.del(`${BASE_URL}/user`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(deleteUserRes, { 'delete user success': (r) => r.status === 200 });
  sleep(1);
}
