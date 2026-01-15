import type { Feature } from './types';

import app from '../app';
import chain from '../chain';
import { getEnvValue, parseEnvJson } from '../utils';
import opSuperchain from './opSuperchain';

const walletConnectProjectId = getEnvValue('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');

const title = 'Blockchain interaction (writing to contract, etc.)';

const config: Feature<{ walletConnect: { projectId: string; featuredWalletIds: Array<string> } }> = (() => {

  // all chain parameters are required for wagmi provider
  // @wagmi/chains/dist/index.d.ts
  const isSingleChain = Boolean(
    chain.id &&
    chain.name &&
    chain.currency.name &&
    chain.currency.symbol &&
    chain.currency.decimals &&
    chain.rpcUrls.length > 0,
  );

  const isOpSuperchain = opSuperchain.isEnabled;

  if (
    !app.isPrivateMode &&
    (isSingleChain || isOpSuperchain) &&
    walletConnectProjectId
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      walletConnect: {
        projectId: walletConnectProjectId,
        featuredWalletIds: parseEnvJson<Array<string>>(getEnvValue('NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS')) ?? [],
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
