// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'src/api/config';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Cross-chain transactions';

export const crossChainTxsBridgeIds =
  parseEnvJson<Array<number>>(getEnvValue('NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS')) ?? [];

export const crossChainTxsIncludeUnindexedChains =
  getEnvValue('NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS') === 'true';

const config: Feature<{}> = (() => {
  if (getEnvValue('NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED') === 'true' && apis.interchainIndexer) {
    return Object.freeze({
      title,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
