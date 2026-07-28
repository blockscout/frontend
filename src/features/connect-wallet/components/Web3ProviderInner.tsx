// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { Config } from 'wagmi';
import { WagmiProvider } from 'wagmi';

import AccountPublisher from './AccountPublisher';

// The native wagmi provider, mounted lazily by `<Web3Provider>` once the runtime has loaded — as a sibling
// of the app, NOT a wrapper, so it hosts only `AccountPublisher` (which mirrors account state into the
// Bridge) and never the app tree. Living in its own module keeps its static wagmi import inside the wallet
// chunk, off the critical path. wagmi's own `<Hydrate>` (inside `<WagmiProvider>`) restores the persisted
// state and reconnects — `reconnectOnMount` is gated on a persisted connection so a never-connected user
// gets no reconnect spinner. This is the single connection owner; `<Web3Boundary>` islands reuse the same
// config read-only, so they never re-hydrate or double-reconnect.
interface Props {
  config: Config;
  reconnectOnMount: boolean;
}

const Web3ProviderInner = ({ config, reconnectOnMount }: Props) => {
  return (
    <WagmiProvider config={ config } reconnectOnMount={ reconnectOnMount }>
      <AccountPublisher/>
    </WagmiProvider>
  );
};

export default React.memo(Web3ProviderInner);
