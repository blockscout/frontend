// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ZetaChainChainsConfigEnv } from 'src/features/chain-variants/zeta-chain/types/client';

export const zetaChainChainsConfig: Array<ZetaChainChainsConfigEnv> = [
  {
    chain_id: 7000,
    chain_name: 'ZetaChain Athens',
    chain_logo: 'https://example.com/zetachain-logo.svg',
    instance_url: 'https://zetachain-indexer.duckdns.org',
  },
  {
    chain_id: 7001,
    chain_name: 'ZetaChain Athens Testnet',
    chain_logo: 'https://example.com/zetachain-testnet-logo.svg',
    instance_url: 'https://zetachain-testnet-indexer.duckdns.org',
  },
];

export const zetaChainExternalSearchConfig = [
  { regex: '^0x[a-f0-9]{64}$', template: 'https://example.com/{value}', name: 'Foo' },
];
