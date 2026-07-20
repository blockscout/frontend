// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { UseAccountReturnType } from 'wagmi';

import { useWeb3Account } from 'src/features/connect-wallet/utils/bridge';

// Bridge-backed replacement for wagmi's `useAccount` in reown mode. Reads account state from the
// always-mounted Bridge (optimistic at boot, confirmed once the runtime loads), so boot-time consumers
// (header button, ad banner, ENS lookup) no longer pull the wagmi/appkit chunks onto the critical path.
//
// The Bridge only tracks address + status; `chain`/`chainId`/`connector`/`addresses` are not needed by
// any boot consumer, so they are filled with the same defaults the fallback/dynamic account hooks use.
// The status mapping mirrors wagmi's own `getAccount` (the `optimistic` phase presents as `reconnecting`).
export default function useAccountReown(): UseAccountReturnType {
  const { address, status } = useWeb3Account();

  return React.useMemo(() => {
    const base = {
      addresses: address ? ([ address ] as unknown as UseAccountReturnType['addresses']) : undefined,
      chain: undefined,
      chainId: undefined,
      connector: undefined,
    };

    switch (status) {
      case 'connected':
        return {
          ...base,
          address: address as `0x${ string }` | undefined,
          isConnected: true,
          isConnecting: false,
          isDisconnected: false,
          isReconnecting: false,
          status: 'connected',
        } as unknown as UseAccountReturnType;
      case 'reconnecting':
      case 'optimistic':
        return {
          ...base,
          address: address as `0x${ string }` | undefined,
          isConnected: Boolean(address),
          isConnecting: false,
          isDisconnected: false,
          isReconnecting: true,
          status: 'reconnecting',
        } as unknown as UseAccountReturnType;
      case 'connecting':
        return {
          ...base,
          address: address as `0x${ string }` | undefined,
          isConnected: false,
          isConnecting: true,
          isDisconnected: false,
          isReconnecting: false,
          status: 'connecting',
        } as unknown as UseAccountReturnType;
      case 'disconnected':
      default:
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
        } as unknown as UseAccountReturnType;
    }
  }, [ address, status ]);
}
