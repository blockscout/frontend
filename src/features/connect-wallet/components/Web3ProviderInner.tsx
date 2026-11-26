// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { Config } from 'wagmi';
import { WagmiProvider } from 'wagmi';

import AccountPublisher from './AccountPublisher';

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
