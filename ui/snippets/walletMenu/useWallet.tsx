import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import * as mixpanel from 'lib/mixpanel/index';

interface Params {
  source: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
}

export default function useWallet({ source }: Params) {
  const { open } = useWeb3Modal();
  const { open: isOpen } = useWeb3ModalState();
  const { disconnect } = useDisconnect();
  const [ isModalOpening, setIsModalOpening ] = React.useState(false);
  const [ isClientLoaded, setIsClientLoaded ] = React.useState(false);
  const isConnectionStarted = React.useRef(false);

  React.useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const handleConnect = React.useCallback(async() => {
    setIsModalOpening(true);
    await open();
    setIsModalOpening(false);
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Started' });
    isConnectionStarted.current = true;
  }, [ open, source ]);

  const handleAccountConnected = React.useCallback(({ isReconnected }: { isReconnected: boolean }) => {
    !isReconnected && isConnectionStarted.current &&
      mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Connected' });
    isConnectionStarted.current = false;
  }, [ source ]);

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
