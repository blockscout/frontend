import chain from '../chain';
import { getEnvValue } from '../utils';

const walletConnectProjectId = getEnvValue(process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID);

export default Object.freeze({
  title: 'Blockchain interaction (writing to contract, etc.)',
  isEnabled: Boolean(
    // all chain parameters are required for wagmi provider
    // @wagmi/chains/dist/index.d.ts
    chain.id &&
    chain.name &&
    chain.currency.name &&
    chain.currency.symbol &&
    chain.currency.decimals &&
    chain.rpcUrl &&
    walletConnectProjectId,
  ),
  walletConnect: {
    projectId: walletConnectProjectId ?? '',
  },
});
