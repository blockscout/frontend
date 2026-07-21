// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import { WagmiContext, WagmiProvider } from 'wagmi';

import { ensureLoaded } from 'src/features/connect-wallet/utils/runtime';
import type { Web3Runtime } from 'src/features/connect-wallet/utils/runtime';

interface Props {
  children: React.ReactNode;
  // the wrapped feature's existing loading/skeleton state, shown while the wallet chunks load (and left
  // in place if they fail — the feature's wagmi hooks can't mount without a config). Defaults to nothing.
  fallback?: React.ReactNode;
}

const Web3Boundary = ({ children, fallback = null }: Props) => {
  const existingConfig = React.useContext(WagmiContext);

  const [ runtime, setRuntime ] = React.useState<Web3Runtime | undefined>();

  React.useEffect(() => {
    if (existingConfig) {
      return;
    }

    let isActive = true;
    ensureLoaded().then((loaded) => {
      if (isActive) {
        setRuntime(loaded);
      }
    });

    return () => {
      isActive = false;
    };
  }, [ existingConfig ]);

  if (existingConfig) {
    return children;
  }

  // Still loading, or the wallet chunks failed to load (disabled runtime → no config): the feature can't
  // mount its wagmi hooks without a config, so we keep its own skeleton up — degraded, never a blank page.
  if (!runtime?.config) {
    return fallback;
  }

  // `reconnectOnMount={ false }`: the Runtime already hydrated the persisted state and triggered reconnect
  // when it loaded (wagmi's `<Hydrate>` would otherwise re-run it because the config is `ssr: true`). This
  // provider exists only to expose the config to the feature's wagmi React hooks.
  return (
    <WagmiProvider config={ runtime.config } reconnectOnMount={ false }>
      { children }
    </WagmiProvider>
  );
};

export default Web3Boundary;
