// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import useWeb3Wallet from 'client/features/connect-wallet/hooks/useWallet';

import removeQueryParam from 'client/shared/router/remove-query-param';
import updateQueryParam from 'client/shared/router/update-query-param';

export default function useAutoConnectWallet() {
  const router = useRouter();
  const web3Wallet = useWeb3Wallet({ source: 'Swap button' });
  const isConnectionStarted = useRef(false);

  useEffect(() => {
    if (router.query.action !== 'connect') {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    if (!web3Wallet.isConnected && !web3Wallet.isOpen) {
      if (!isConnectionStarted.current) {
        timer = setTimeout(() => {
          if (!web3Wallet.isConnected) {
            web3Wallet.connect();
            isConnectionStarted.current = true;
          }
        }, 500);
      } else {
        isConnectionStarted.current = false;
        updateQueryParam(router, 'action', 'tooltip');
      }
    } else if (web3Wallet.isConnected) {
      isConnectionStarted.current = false;
      removeQueryParam(router, 'action');
    }

    return () => clearTimeout(timer);
  }, [ router, web3Wallet ]);
}
