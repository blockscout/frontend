import type { Feature } from './types';

import apis from '../apis';
import { getEnvValue } from '../utils';

const title = 'Clusters Universal Name Service';

const config: Feature<{ cdnUrl: string }> = (() => {
  const cdnUrl = getEnvValue('NEXT_PUBLIC_CLUSTERS_CDN_URL') || 'https://cdn.clusters.xyz';

  if (apis.clusters) {
    return Object.freeze({
      title,
      isEnabled: true,
      cdnUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
    cdnUrl,
  });
})();

export default config;
