// SPDX-License-Identifier: LicenseRef-Blockscout

import { createPublicClient, http } from 'viem';
import type { PublicClient } from 'viem';

import { chains } from 'src/features/connect-wallet/utils/chains';
import essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps';

export default function createRevokeBlockscoutClient(chainId: string | undefined): PublicClient | undefined {
  const chain = chains.find((chain) => chain.id === Number(chainId));
  const chainConfig = essentialDappsChainsConfig()?.chains.find((chain) => chain.id === chainId);
  const coreEndpoint = chainConfig?.app_config?.apis?.core?.endpoint;

  if (!chain || !coreEndpoint) return undefined;

  return createPublicClient({
    chain,
    transport: http(`${ coreEndpoint }/api/eth-rpc`, {
      batch: { wait: 100, batchSize: 5 },
      retryCount: 5,
      retryDelay: 5_000,
      timeout: 60_000,
    }),
  });
}
