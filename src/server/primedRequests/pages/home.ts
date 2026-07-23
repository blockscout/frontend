// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

import config from 'src/config';

const rollupFeature = config.features.rollup;

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
    ...(config.chain.indexingStatus.blocks.isHidden ? [] : [ { resource: 'core:homepage_indexing_status' } satisfies PrimedResource ]),
    { resource: 'core:homepage_txs' },
    ...leftWidget,
    ...(config.apis.stats ? [ { resource: 'stats:pages_main' } satisfies PrimedResource ] : []),
  ];
};

export const homePage: PagePrimerConfig = {
  resources: getResources,
};
