// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

import config from 'src/config';

const getResources = (): Array<PrimedResource> => {
  if (config.features.multichain.isEnabled) {
    // the multichain stats page renders a different component with its own resources
    return [];
  }

  if (!config.apis.stats) {
    return [];
  }

  return [
    { resource: 'stats:lines' },
    { resource: 'stats:counters' },
    ...(config.features.gasTracker.isEnabled ? [ { resource: 'core:stats' } satisfies PrimedResource ] : []),
  ];
};

export const statsPage: PagePrimerConfig = {
  resources: getResources,
};
