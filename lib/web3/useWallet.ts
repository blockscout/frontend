import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import React from 'react';
import { useAccount, useDisconnect, useAccountEffect } from 'wagmi';

import * as mixpanel from 'lib/mixpanel/index';

interface Params {
  source: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
}

export default function useWeb3Wallet({ source }: Params) {
  const { open: openModal } = useWeb3Modal();
  const { open: isOpen } = useWeb3ModalState();
  const { disconnect } = useDisconnect();
  const [ isOpening, setIsOpening ] = React.useState(false);
  const [ isClientLoaded, setIsClientLoaded ] = React.useState(false);
  const isConnectionStarted = React.useRef(false);

  React.useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const handleConnect = React.useCallback(async() => {
    setIsOpening(true);
    await openModal();
    setIsOpening(false);
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Started' });
    isConnectionStarted.current = true;
  }, [ openModal, source ]);

  const handleAccountConnected = React.useCallback(({ isReconnected }: { isReconnected: boolean }) => {
    if (!isReconnected && isConnectionStarted.current) {
      mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Connected' });
      mixpanel.userProfile.setOnce({
        'With Connected Wallet': true,
      });
    }
    isConnectionStarted.current = false;
  }, [ source ]);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  useAccountEffect({ onConnect: handleAccountConnected });

  const { address, isDisconnected } = useAccount();

  const isConnected = isClientLoaded && !isDisconnected && address !== undefined;

  return React.useMemo(() => ({
    connect: handleConnect,
    disconnect: handleDisconnect,
    isOpen: isOpening || isOpen,
    isConnected,
    address,
    openModal,
  }), [ handleConnect, handleDisconnect, isOpen, isOpening, isConnected, address, openModal ]);
}
