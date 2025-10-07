import { createPublicClient as createPublicClientDefault, http, type Chain } from 'viem';
import * as viemChains from 'viem/chains';

import essentialDappsChains from 'configs/essentialDappsChains';

const allChains = Object.values(viemChains);

export default function createPublicClient(chainId: number) {
  const chain = allChains.find((c) => c.id === chainId);
  const explorerUrl = essentialDappsChains[chainId];
  if (!chain || !explorerUrl) return undefined;

  return createPublicClientDefault({
    chain: chain as Chain,
    transport: http(`${ explorerUrl }/api/eth-rpc`, { batch: { wait: 100, batchSize: 5 } }),
    batch: { multicall: true },
  });
}
