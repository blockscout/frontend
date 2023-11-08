import { useWeb3Modal } from '@web3modal/react';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import * as mixpanel from 'lib/mixpanel/index';

export default function useWallet() {
  const { open, isOpen } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [ isModalOpening, setIsModalOpening ] = React.useState(false);
  const [ isClientLoaded, setIsClientLoaded ] = React.useState(false);

  React.useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const handleConnect = React.useCallback(async() => {
    setIsModalOpening(true);
    await open();
    setIsModalOpening(false);
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Status: 'Started' });
  }, [ open ]);

  const handleAccountConnected = React.useCallback(({ isReconnected }: { isReconnected: boolean }) => {
    !isReconnected && mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Status: 'Connected' });
  }, []);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  const { address, isDisconnected } = useAccount({ onConnect: handleAccountConnected });

  const isWalletConnected = isClientLoaded && !isDisconnected && address !== undefined;

  return {
    isWalletConnected,
    address: address || '',
    connect: handleConnect,
    disconnect: handleDisconnect,
    isModalOpening,
    isModalOpen: isOpen,
  };
}
