import { config } from './config';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isBackendReady(): Promise<boolean> {
  try {
    const response = await fetch(`${config.backendUrl}/contents`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function waitForBackend(): Promise<void> {
  for (let attempt = 1; attempt <= config.readyCheckRetries; attempt++) {
    if (await isBackendReady()) return;
    console.log(`[seed] Waiting for backend (attempt ${attempt}/${config.readyCheckRetries})...`);
    await delay(config.readyCheckIntervalMs);
  }
  throw new Error('Backend did not become ready in time');
}
