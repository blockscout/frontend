import type { Feature } from './types';

import apis from '../apis';
import { getEnvValue } from '../utils';

const title = 'Name services integration';

const config: Feature<{ ens: { isEnabled: boolean }; clusters: { isEnabled: boolean; cdnUrl: string } }> = (() => {
  if (apis.bens || apis.clusters) {
    return Object.freeze({
      title,
      isEnabled: true,
      ens: {
        isEnabled: apis.bens ? true : false,
      },
      clusters: {
        isEnabled: apis.clusters ? true : false,
        cdnUrl: getEnvValue('NEXT_PUBLIC_CLUSTERS_CDN_URL') || 'https://cdn.clusters.xyz',
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
