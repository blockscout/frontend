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

// Island for route features that use wagmi hooks (contract methods, revoke, L2 claims, marketplace bridge).
// In reown/fallback mode the app tree is NOT under a `<WagmiProvider>` (that would remount the whole app
// when the wallet loads — see `context`), so each feature gets the wagmi config injected here, over
// just its own subtree. It publishes the SAME config the sibling provider owns, read-only: no `<Hydrate>`,
// so it never re-hydrates or double-reconnects — it only reads the connection state that provider maintains.
//
// The feature's real content mounts once, when ready — never before — so there is no lost-state remount:
// before the runtime loads it shows the fallback; the `WagmiContext` value flips from undefined to the
// config in place. If the chunks fail to load, `useIsWeb3Ready` stays false and the fallback stays up.
//
// Dynamic connector mode is different: `<DynamicProvider>` wraps the whole app in a root `<WagmiProvider>`,
// so a config is already in context here. There is nothing to lazy-load or gate on — the boundary must be
// transparent and render children straight away, otherwise `useIsWeb3Ready` (which only `<Web3Provider>`
// supplies) is never true and the feature is stuck on its fallback forever.
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

  if (existingConfig) {
    return children;
  }

  return (
    <WagmiContext.Provider value={ config }>
      { isReady && config ? children : fallback }
    </WagmiContext.Provider>
  );
};

export default Web3Boundary;
