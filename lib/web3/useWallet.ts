import { useAppKit, useAppKitState } from '@reown/appkit/react';
import React from 'react';
import { useDisconnect, useAccountEffect } from 'wagmi';

import * as mixpanel from 'lib/mixpanel/index';
import useAccount from 'lib/web3/useAccount';

interface Params {
  source: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
  onConnect?: () => void;
}

export default function useWeb3Wallet({ source, onConnect }: Params) {
  const { open: openModal } = useAppKit();
  const { open: isOpen } = useAppKitState();
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
      onConnect?.();
    }
    isConnectionStarted.current = false;
  }, [ source, onConnect ]);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  useAccountEffect({ onConnect: handleAccountConnected });

  const account = useAccount();
  const address = account.address;
  const isConnected = isClientLoaded && !account.isDisconnected && account.address !== undefined;

  return React.useMemo(() => ({
    connect: handleConnect,
    disconnect: handleDisconnect,
    isOpen: isOpening || isOpen,
    isConnected,
    isReconnecting: account.isReconnecting,
    address,
    openModal,
  }), [ handleConnect, handleDisconnect, isOpening, isOpen, isConnected, account.isReconnecting, address, openModal ]);
}
