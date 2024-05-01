import type { UseAccountReturnType } from 'wagmi';
import { useAccount } from 'wagmi';

import config from 'configs/app';

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
