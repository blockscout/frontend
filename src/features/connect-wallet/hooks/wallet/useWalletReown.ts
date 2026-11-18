// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Params, Result } from './types';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import * as analytics from 'src/shared/analytics';

import { useWeb3Account, subscribeConnection } from '../../utils/bridge';
import { ensureLoaded } from '../../utils/runtime';
import useWalletFallback from './useWalletFallback';

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
          analytics.logEvent(analytics.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Connected' });
          analytics.userProfile.setOnce({ 'With Connected Wallet': true });
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

  // Loads the runtime and opens the AppKit modal, returning the runtime so `connect` can gate its analytics
  // on `isReady`. The exposed `openModal` discards it (the `Result` contract is `Promise<void>`).
  const loadAndOpenModal = React.useCallback(async() => {
    setIsOpening(true);
    const runtime = await ensureLoaded();
    subscribeModal(runtime);
    await runtime.openModal();
    setIsOpening(false);
    return runtime;
  }, [ subscribeModal ]);

  const openModal = React.useCallback(async() => {
    await loadAndOpenModal();
  }, [ loadAndOpenModal ]);

  const connect = React.useCallback(async() => {
    const runtime = await loadAndOpenModal();
    // After a failed chunk load the modal never opens: no connection is started, and no later connect
    // belongs to this click.
    if (runtime.isReady) {
      analytics.logEvent(analytics.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Started' });
      isConnectionStarted.current = true;
    }
  }, [ source, loadAndOpenModal ]);

  const disconnect = React.useCallback(async() => {
    const runtime = await ensureLoaded();
    await runtime.disconnect();
  }, []);

  // `reconnecting` counts as connected, so a returning user sees their address, not a "Connect" flash.
  const isConnected = status !== 'disconnected' && status !== 'connecting' && Boolean(address);
  const isReconnecting = status === 'reconnecting';

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
