// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import { WagmiContext } from 'wagmi';

import { useIsWeb3Ready } from '../context';
import { ensureLoaded, getLoadedRuntime } from '../utils/runtime';

interface Props {
  children: React.ReactNode;
  // the wrapped feature's existing loading/skeleton state, shown while the wallet chunks load (and left in
  // place if they fail — the feature's wagmi hooks can't mount without a config). Defaults to nothing.
  fallback?: React.ReactNode;
}

const Web3Boundary = ({ children, fallback = null }: Props) => {
  const existingConfig = React.useContext(WagmiContext);
  const isReady = useIsWeb3Ready();
  const config = getLoadedRuntime()?.config;

  React.useEffect(() => {
    if (existingConfig) {
      return;
    }
    ensureLoaded();
  }, [ existingConfig ]);

  // An ancestor `<WagmiProvider>`, as in the test harnesses, already supplies the config. Gating on
  // `useIsWeb3Ready` there would keep the fallback up forever: no `<Web3Provider>` sets it.
  if (existingConfig) {
    return children;
  }

  // The context alone, not `<WagmiProvider>`: its `<Hydrate>` would hydrate and reconnect a second time.
  return (
    <WagmiContext.Provider value={ config }>
      { isReady && config ? children : fallback }
    </WagmiContext.Provider>
  );
};

export default Web3Boundary;
