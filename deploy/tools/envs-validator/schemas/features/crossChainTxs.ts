// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, envJson, envUrl, requiredIf, requires } from '../../utils';

export const crossChainTxsSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS: v.optional(envJson(v.array(v.number()))),
    NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS: v.optional(envBoolean()),
    NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST: v.optional(envUrl()),
  }),
  requires('NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS', 'NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED'),
  requiredIf('NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS', 'NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED'),
  requires('NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS', 'NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED'),
  requires('NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST', 'NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED'),
);
