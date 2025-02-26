// createEmotionCache.ts
import createCache from '@emotion/cache';

import config from 'configs/app';

// Create a deterministic key that's consistent between server and client
// but can be different for different app instances
const getEmotionCacheKey = () => {
  // Use a prefix for all instances
  const baseKey = 'css';

  // Add a suffix based on the host if available
  // This ensures different instances have different keys
  const hostKey = config.app.host ? `-${ config.app.host.replace(/[^a-z0-9]/gi, '') }` : '';

  return `${ baseKey }${ hostKey }`;
};

// Generate the key once at module load time to ensure consistency
const emotionCacheKey = getEmotionCacheKey();

export default function createEmotionCache() {
  return createCache({
    key: emotionCacheKey,
    prepend: true,
  });
}
