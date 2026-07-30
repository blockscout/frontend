// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import { useAccount, useAccountEffect } from 'wagmi';

import * as bridge from '../utils/bridge';

// Rendered inside `<WagmiProvider>`, so it can use wagmi's native hooks. It is the SOLE writer of the
// Bridge account state: it mirrors wagmi's confirmed `useAccount` into the Bridge for boot-time consumers,
// keeps our own persisted flag in sync (drives the optimistic header display + eager reconnect), and emits
// connect/disconnect for the `WALLET_CONNECT` analytics. Reconnection/hydration are wagmi's job — this
// component only observes and forwards, so nothing wagmi-internal is reimplemented.
const AccountPublisher = () => {
  const { address, status } = useAccount();

  React.useEffect(() => {
    // wagmi's status values line up with the Bridge's ('connecting' | 'reconnecting' | 'connected' |
    // 'disconnected'), so this is a straight mirror — no reinterpretation.
    bridge.setWeb3Account({ address, status });

    // Reconcile the optimistic flag with wagmi, the source of truth once mounted: if wagmi settled to
    // disconnected our persisted flag is stale (a failed reconnect, or wagmi cleared its own store), so
    // drop it — otherwise the header would stick on the reconnecting style. `reconnectOnMount` starts a
    // returning user at `reconnecting`, not `disconnected`, so this never clears a valid optimistic seed.
    if (status === 'disconnected') {
      bridge.clearWalletFlag();
    }
  }, [ address, status ]);

  useAccountEffect({
    onConnect: ({ address, isReconnected }) => {
      bridge.setWalletFlag(address);
      bridge.emitConnectionChange({ type: 'connect', address, isReconnected });
    },
    onDisconnect: () => {
      bridge.clearWalletFlag();
      bridge.emitConnectionChange({ type: 'disconnect' });
    },
  });

  return null;
};

export default AccountPublisher;
