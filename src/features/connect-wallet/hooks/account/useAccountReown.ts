// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { UseAccountReturnType } from 'wagmi';

import { useWeb3Account } from 'src/features/connect-wallet/utils/bridge';

// Unlike wagmi's `useAccount`, `chain`, `chainId` and `connector` are always undefined.
export default function useAccountReown(): UseAccountReturnType {
  const { address, status } = useWeb3Account();

  return React.useMemo(() => {
    const base = {
      addresses: address ? ([ address ] as unknown as UseAccountReturnType['addresses']) : undefined,
      chain: undefined,
      chainId: undefined,
      connector: undefined,
    };

    // The status mapping source - node_modules/@wagmi/core/src/actions/getAccount.ts
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
