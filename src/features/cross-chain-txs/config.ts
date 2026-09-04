// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'src/api/config';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Cross-chain transactions';

const bridgeIds =
  parseEnvJson<Array<number>>(getEnvValue('NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS')) ?? [];

const includeUnindexedChains =
  getEnvValue('NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS') === 'true';

const config: Feature<{ bridgeIds: Array<number>; includeUnindexedChains: boolean }> = (() => {
  if (
    getEnvValue('NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED') === 'true' &&
    apis.interchainIndexer &&
    bridgeIds.length > 0
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      bridgeIds,
      includeUnindexedChains,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
