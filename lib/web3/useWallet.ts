import { useDynamicContext, useDynamicEvents, useUserWallets } from '@dynamic-labs/sdk-react-core';
import { useAppKit, useAppKitState } from '@reown/appkit/react';
import React from 'react';
import { useDisconnect, useAccountEffect } from 'wagmi';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';
import useAccount from 'lib/web3/useAccount';

const feature = config.features.blockchainInteraction;

interface Params {
  source: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
  onConnect?: () => void;
}

function useWalletReown({ source, onConnect }: Params) {
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

function useWalletDynamic({ source, onConnect }: Params) {
  const isConnectionStarted = React.useRef(false);
  const [ isOpen, setIsOpen ] = React.useState(false);
  const [ isClientLoaded, setIsClientLoaded ] = React.useState(false);

  const { setShowDynamicUserProfile, primaryWallet, setAuthMode } = useDynamicContext();
  const userWallets = useUserWallets();

  const openModal = React.useCallback(() => {
    setShowDynamicUserProfile(true);
  }, [ setShowDynamicUserProfile ]);

  useDynamicEvents('authFlowOpen', async() => {
    setIsOpen(true);
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Started' });
    isConnectionStarted.current = true;
  });
  useDynamicEvents('authFlowClose', async() => {
    setIsOpen(false);
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
    // TODO @tom2drum unable to authenticate user if he connects his wallet first
    setAuthMode('connect-only');
    openModal();
  }, [ setAuthMode, openModal ]);

  useAccountEffect({ onConnect: handleAccountConnected });

  React.useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const address = primaryWallet?.address || userWallets[0]?.address;
  const isConnected = isClientLoaded && Boolean(address);

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

function useWalletFallback() {
  return {
    connect: () => {},
    disconnect: () => {},
    isOpen: false,
    isConnected: false,
    isReconnecting: false,
    address: undefined,
    openModal: () => {},
  };
}

const useWallet = (() => {
  if (feature.isEnabled && feature.connectorType === 'reown') {
    return useWalletReown;
  }

  if (feature.isEnabled && feature.connectorType === 'dynamic') {
    return useWalletDynamic;
  }

  return useWalletFallback;
})();

export default useWallet;
