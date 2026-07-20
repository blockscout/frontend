// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Params, Result } from './types';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import * as mixpanel from 'src/services/mixpanel';

import { useWeb3Account, subscribeConnection } from '../../utils/bridge';
import { ensureLoaded } from '../../utils/runtime';
import useWalletFallback from './useWalletFallback';

// Bridge/Runtime-backed reown wallet hook. Replaces the old `@reown/appkit/react` + wagmi-React
// implementation so the header no longer awaits the wallet chunks: account state comes from the Bridge,
// and connect/disconnect/modal go through the lazily-loaded Runtime (`ensureLoaded()` on interaction).
export function useWalletReown({ source, onConnect }: Params): Result {
  const { address, status } = useWeb3Account();
  const [ isOpening, setIsOpening ] = React.useState(false);
  const [ isModalOpen, setIsModalOpen ] = React.useState(false);
  const isConnectionStarted = React.useRef(false);
  const modalUnsubRef = React.useRef<(() => void) | undefined>(undefined);
  const onConnectRef = React.useRef(onConnect);
  onConnectRef.current = onConnect;

  // `WALLET_CONNECT` "Connected" analytics — fire only for a fresh, user-initiated connection
  // (not an auto-reconnect), keyed off the isConnectionStarted ref set by `connect`.
  React.useEffect(() => {
    return subscribeConnection({
      onConnect: ({ isReconnected }) => {
        if (!isReconnected && isConnectionStarted.current) {
          mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Connected' });
          mixpanel.userProfile.setOnce({ 'With Connected Wallet': true });
          onConnectRef.current?.();
        }
        isConnectionStarted.current = false;
      },
    });
  }, [ source ]);

  React.useEffect(() => () => modalUnsubRef.current?.(), []);

  // Subscribe to the AppKit modal state once the runtime is loaded (idempotent). We never force the load
  // just to observe modal state — the modal can only open via connect/openModal, which load it first.
  const subscribeModal = React.useCallback((runtime: Awaited<ReturnType<typeof ensureLoaded>>) => {
    if (modalUnsubRef.current) {
      return;
    }
    modalUnsubRef.current = runtime.subscribeModalState(setIsModalOpen);
  }, []);

  const openModal = React.useCallback(async() => {
    setIsOpening(true);
    const runtime = await ensureLoaded();
    subscribeModal(runtime);
    await runtime.openModal();
    setIsOpening(false);
  }, [ subscribeModal ]);

  const connect = React.useCallback(async() => {
    setIsOpening(true);
    const runtime = await ensureLoaded();
    subscribeModal(runtime);
    await runtime.openModal();
    setIsOpening(false);
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Started' });
    isConnectionStarted.current = true;
  }, [ source, subscribeModal ]);

  const disconnect = React.useCallback(async() => {
    const runtime = await ensureLoaded();
    await runtime.disconnect();
  }, []);

  // matches the old `isConnected = !isDisconnected && address !== undefined` (see wagmi getAccount);
  // `optimistic`/`reconnecting` keep the address visible in the reconnecting style — no "Connect" flash
  const isConnected = status !== 'disconnected' && status !== 'connecting' && Boolean(address);
  const isReconnecting = status === 'reconnecting' || status === 'optimistic';

  return React.useMemo(() => ({
    connect,
    disconnect,
    isOpen: isOpening || isModalOpen,
    isConnected,
    isReconnecting,
    address,
    openModal,
  }), [ connect, disconnect, isOpening, isModalOpen, isConnected, isReconnecting, address, openModal ]);
}

export default getFeaturePayload(config.features.connectWallet)?.connectorType === 'reown' ? useWalletReown : useWalletFallback;
