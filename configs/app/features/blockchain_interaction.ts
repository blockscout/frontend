import chain from '../chain';
import { getEnvValue } from '../utils';

const walletConnectProjectId = getEnvValue(process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID);

export default Object.freeze({
  title: 'Blockchain interaction (writing to contract, etc.)',
  // TODO @tom2drum add currency and chain id
  isEnabled: Boolean(walletConnectProjectId && chain.rpcUrl),
  walletConnect: {
    projectId: walletConnectProjectId ?? '',
  },
});
