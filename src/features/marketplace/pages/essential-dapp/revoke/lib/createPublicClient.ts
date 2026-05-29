// SPDX-License-Identifier: LicenseRef-Blockscout

import { createPublicClient as createPublicClientDefault, http } from 'viem';
import type { PublicClient } from 'viem';

import { chains } from 'src/features/connect-wallet/utils/chains';
import essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps';

export default function createPublicClient(chainId: string | undefined): PublicClient | undefined {
  const chain = chains.find((chain) => chain.id === Number(chainId));
  const chainConfig = essentialDappsChainsConfig()?.chains.find((chain) => chain.id === chainId);

  if (!chain || !chainConfig) return undefined;

  return createPublicClientDefault({
    chain,
    transport: http(`${ chainConfig?.app_config?.apis?.general?.endpoint }/api/eth-rpc`, { batch: { wait: 100, batchSize: 5 } }),
    batch: { multicall: true },
  });
}
