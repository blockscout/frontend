// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ParentChain } from 'src/features/rollup/common/types/config';

export const parentChainMinimal: ParentChain = {
  baseUrl: 'https://explorer.duckchain.io',
};

export const parentChainFull: ParentChain = {
  baseUrl: 'https://explorer.duckchain.io',
  currency: { name: 'Quack', symbol: 'QUACK', decimals: 18 },
  isTestnet: true,
  id: 42,
  name: 'DuckChain',
  rpcUrls: [ 'https://rpc.duckchain.io' ],
};
