import { config } from './config';

async function registerSeedUser(): Promise<void> {
  const response = await fetch(`${config.backendUrl}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: config.seedUserName,
      email: config.seedUserEmail,
      password: config.seedUserPassword,
    }),
  });
  if (response.ok || response.status === 409) return;
  throw new Error(`Failed to register seed user: ${response.status} ${await response.text()}`);
}

async function loginSeedUser(): Promise<string> {
  const response = await fetch(`${config.backendUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.seedUserEmail,
      password: config.seedUserPassword,
    }),
  });
  if (!response.ok) throw new Error(`Failed to login seed user: ${response.status} ${await response.text()}`);
  const body = (await response.json()) as { access_token: string };
  return `access_token=${body.access_token}`;
}

export async function authenticateSeedUser(): Promise<string> {
  await registerSeedUser();
  return loginSeedUser();
}
