import React from 'react';
import { WagmiProvider as WagmiProviderCore } from 'wagmi';

import wagmiConfig from 'client/shared/web3/wagmi-config';

interface Props {
  children: React.ReactNode;
}

const WagmiProvider = ({ children }: Props) => {
  return (
    <WagmiProviderCore config={ wagmiConfig.config }>
      { children }
    </WagmiProviderCore>
  );
};

export default React.memo(WagmiProvider);
