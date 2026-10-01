// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BridgedTokenChain, TokenBridge } from 'src/features/bridged-tokens/types/client';

export const bridgedTokenChains: Array<BridgedTokenChain> = [
  { id: '1', title: 'Ethereum', short_title: 'ETH', base_url: 'https://example.com' },
];

export const tokenBridges: Array<TokenBridge> = [
  { type: 'omni', title: 'OmniBridge', short_title: 'OMNI' },
];
