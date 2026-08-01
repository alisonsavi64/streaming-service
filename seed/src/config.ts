export const config = {
  backendUrl: process.env.BACKEND_URL ?? 'http://backend:3001',
  seedUserName: process.env.SEED_USER_NAME ?? 'Seed Bot',
  seedUserEmail: process.env.SEED_USER_EMAIL ?? 'seed@streaming.local',
  seedUserPassword: process.env.SEED_USER_PASSWORD ?? 'seed123456',
  seedVideoCount: Number(process.env.SEED_VIDEO_COUNT ?? 30),
  thumbnailPath: process.env.SEED_THUMBNAIL_PATH ?? '/app/assets/default-thumbnail.jpg',
  sourceVideoPath: process.env.SEED_SOURCE_VIDEO_PATH ?? '/app/assets/sample-video.mp4',
  readyCheckRetries: Number(process.env.SEED_READY_RETRIES ?? 30),
  readyCheckIntervalMs: Number(process.env.SEED_READY_INTERVAL_MS ?? 2000),
};
