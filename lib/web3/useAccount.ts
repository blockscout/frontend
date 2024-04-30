import type { UseAccountReturnType } from 'wagmi';
import { useAccount } from 'wagmi';

import config from 'configs/app';

// TODO @tom2drum search for other place where we need account with fallback
function useAccountFallback(): UseAccountReturnType {
  return {
    address: undefined,
    addresses: undefined,
    chain: undefined,
    chainId: undefined,
    connector: undefined,
    isConnected: false,
    isConnecting: false,
    isDisconnected: true,
    isReconnecting: false,
    status: 'disconnected',
  };
}

const hook = config.features.blockchainInteraction.isEnabled ? useAccount : useAccountFallback;

export default hook;
