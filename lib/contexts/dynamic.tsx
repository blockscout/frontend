import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import React from 'react';

import config from 'configs/app';

const accountFeature = config.features.account;
const walletConnectors = [
  EthereumWalletConnectors,
];

interface Props {
  children: React.ReactNode;
}

const EmptyProvider = ({ children }: Props) => {
  return children;
};

const DefaultProvider = ({ children }: Props) => {

  const settings = React.useMemo(() => {
    const accountFeature = config.features.account;
    const environmentId = accountFeature.isEnabled && accountFeature.authProvider === 'dynamic' ? accountFeature.dynamic?.environmentId : undefined;

    if (!environmentId) {
      throw new Error('Dynamic environment ID is not set');
    }

    return {
      walletConnectors,
      environmentId,
      // events: {
      //   onAuthSuccess: (args) => {
      //     console.log('onAuthSuccess was called', args);
      //     // you can get the jwt by calling the getAuthToken helper function
      //     const authToken = getAuthToken();
      //     console.log('authToken', authToken);
      //   },
      // },
    };
  }, []);

  return (
    <DynamicContextProvider
      settings={ settings }
    >
      <DynamicWagmiConnector>
        { children }
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  );
};

export default accountFeature.isEnabled && accountFeature.authProvider === 'dynamic' ? DefaultProvider : EmptyProvider;
