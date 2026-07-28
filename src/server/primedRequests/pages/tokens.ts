// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

import config from 'src/config';

const getResources = (): Array<PrimedResource> => {
  if (config.features.multichain.isEnabled) {
    // the multichain tokens page renders a different component with its own resources
    return [];
  }

  return [
    { resource: 'core:tokens', searchParams: [ 'q', 'type', 'sort', 'order' ], tabs: [ 'all' ] },
  ];
};

export const tokensPage: PagePrimerConfig = {
  defaultTab: 'all',
  resources: getResources,
};
