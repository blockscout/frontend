import { useDynamicContext, useDynamicEvents } from '@dynamic-labs/sdk-react-core';
import React from 'react';
import { useAccountEffect } from 'wagmi';

import type { Params, Result } from './types';

import * as mixpanel from 'lib/mixpanel/index';

import useAccount from '../useAccount';

export default function useWalletDynamic({ source, onConnect }: Params): Result {
  const isConnectionStarted = React.useRef(false);
  const [ isOpen ] = React.useState(false);
  const [ isClientLoaded, setIsClientLoaded ] = React.useState(false);

  const { setShowDynamicUserProfile, setAuthMode } = useDynamicContext();

  const openModal = React.useCallback(() => {
    setShowDynamicUserProfile(true);
  }, [ setShowDynamicUserProfile ]);

  useDynamicEvents('authFlowOpen', async() => {
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Started' });
    isConnectionStarted.current = true;
  });

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

  const handleConnect = React.useCallback(() => {
    setAuthMode('connect-only');
    openModal();
  }, [ setAuthMode, openModal ]);

  useAccountEffect({ onConnect: handleAccountConnected });

  React.useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const account = useAccount();
  const address = account.address;
  const isConnected = isClientLoaded && !account.isDisconnected && account.address !== undefined;

  return React.useMemo(() => ({
    connect: handleConnect,
    disconnect: openModal,
    isOpen,
    isConnected,
    isReconnecting: false,
    address,
    openModal,
  }), [ handleConnect, openModal, isOpen, isConnected, address ]);
}
