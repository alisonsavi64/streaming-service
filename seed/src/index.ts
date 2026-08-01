import { config } from './config';
import { waitForBackend } from './wait-for-backend';
import { authenticateSeedUser } from './auth';
import { getSeededContentCount, loadSeedAssets, uploadSeedVideo } from './upload-client';

async function main(): Promise<void> {
  await waitForBackend();
  const cookie = await authenticateSeedUser();

  const existingCount = await getSeededContentCount(cookie);
  if (existingCount >= config.seedVideoCount) {
    console.log(`[seed] Already seeded (${existingCount}/${config.seedVideoCount}), skipping.`);
    return;
  }

  const assets = loadSeedAssets();
  for (let index = existingCount + 1; index <= config.seedVideoCount; index++) {
    await uploadSeedVideo(cookie, index, assets);
    console.log(`[seed] Uploaded video ${index}/${config.seedVideoCount}`);
  }

  console.log('[seed] Seeding complete.');
}

main().catch((error) => {
  console.error('[seed] Seeding failed:', error);
  process.exit(1);
});
