import { readFileSync } from 'fs';
import { config } from './config';

export async function getSeededContentCount(cookie: string): Promise<number> {
  const response = await fetch(`${config.backendUrl}/contents/mine`, {
    headers: { Cookie: cookie },
  });
  if (!response.ok) throw new Error(`Failed to list seed user contents: ${response.status} ${await response.text()}`);
  const contents = (await response.json()) as unknown[];
  return contents.length;
}

export async function uploadSeedVideo(cookie: string, index: number): Promise<void> {
  const videoBuffer = readFileSync(config.sourceVideoPath);
  const thumbnailBuffer = readFileSync(config.thumbnailPath);
  const form = new FormData();
  form.append('title', `Seed Video ${index}`);
  form.append('description', `Auto-generated mock video #${index} for local development seeding.`);
  form.append('upload', new Blob([videoBuffer], { type: 'video/mp4' }), `seed-video-${index}.mp4`);
  form.append('thumbnail', new Blob([thumbnailBuffer], { type: 'image/jpeg' }), 'default-thumbnail.jpg');

  const response = await fetch(`${config.backendUrl}/contents`, {
    method: 'POST',
    headers: { Cookie: cookie },
    body: form,
  });
  if (!response.ok) throw new Error(`Failed to upload seed video ${index}: ${response.status} ${await response.text()}`);
}
