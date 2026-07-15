// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

import config from 'src/config';

const rollupFeature = config.features.rollup;

// This list mirrors the API requests the home page widgets make on their first render
// (src/slices/home/pages/index/Home.tsx) — update it when a widget is added/removed or its
// first-render query changes.
const getResources = (): Array<PrimedResource> => {
  if (config.features.multichain.isEnabled) {
    // the multichain home page renders a different widget set with its own resources;
    // whether to prime it is a follow-up (see the task notes for #3566)
    return [];
  }

  const leftWidget: Array<PrimedResource> =
    rollupFeature.isEnabled && !rollupFeature.homepage.showLatestBlocks && rollupFeature.type === 'arbitrum' ?
      [ { resource: 'core:homepage_arbitrum_l2_batches' }, { resource: 'core:homepage_arbitrum_latest_batch' } ] :
      [ { resource: 'core:homepage_blocks' } ];

  return [
    { resource: 'core:stats' },
    { resource: 'core:homepage_indexing_status' },
    { resource: 'core:homepage_txs' },
    ...leftWidget,
    ...(config.apis.stats ? [ { resource: 'stats:pages_main' } satisfies PrimedResource ] : []),
  ];
};

export const homePage: PagePrimerConfig = {
  resources: getResources,
};
