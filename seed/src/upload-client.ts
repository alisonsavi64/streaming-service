import { readFileSync } from 'fs';
import { config } from './config';

const SEED_GENRES = [
  'MUSIC', 'LIFESTYLE', 'GAMING', 'MOVIES', 'EDUCATION', 'TECH',
  'SCIENCE', 'SPORTS', 'NEWS', 'HEALTH', 'TRAVEL', 'FOOD', 'ARTS',
  'COMEDY', 'BEAUTY', 'CARS', 'PETS', 'PHOTOGRAPHY', 'BOOKS',
  'MOTIVATION', 'FINANCE', 'PROGRAMMING',
];

export async function getSeededContentCount(cookie: string): Promise<number> {
  const response = await fetch(`${config.backendUrl}/contents/mine`, {
    headers: { Cookie: cookie },
  });
  if (!response.ok) throw new Error(`Failed to list seed user contents: ${response.status} ${await response.text()}`);
  const contents = (await response.json()) as unknown[];
  return contents.length;
}

export function loadSeedAssets(): { videoBuffer: Buffer; thumbnailBuffer: Buffer } {
  return {
    videoBuffer: readFileSync(config.sourceVideoPath),
    thumbnailBuffer: readFileSync(config.thumbnailPath),
  };
}

export async function uploadSeedVideo(
  cookie: string,
  index: number,
  assets: { videoBuffer: Buffer; thumbnailBuffer: Buffer },
): Promise<void> {
  const form = new FormData();
  form.append('title', `Seed Video ${index}`);
  form.append('description', `Auto-generated mock video #${index} for local development seeding.`);
  form.append('genre', SEED_GENRES[index % SEED_GENRES.length]);
  form.append('upload', new Blob([new Uint8Array(assets.videoBuffer)], { type: 'video/mp4' }), `seed-video-${index}.mp4`);
  form.append('thumbnail', new Blob([new Uint8Array(assets.thumbnailBuffer)], { type: 'image/jpeg' }), 'default-thumbnail.jpg');

  const response = await fetch(`${config.backendUrl}/contents`, {
    method: 'POST',
    headers: { Cookie: cookie },
    body: form,
  });
  if (!response.ok) throw new Error(`Failed to upload seed video ${index}: ${response.status} ${await response.text()}`);
}
