import { useColorModeValue, useToken } from '@chakra-ui/react';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import React from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createClient, WagmiConfig } from 'wagmi';

import type { RoutedSubTab } from 'ui/shared/Tabs/types';

import appConfig from 'configs/app/config';
import { ContractContextProvider } from 'ui/address/contract/context';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

interface Props {
  tabs: Array<RoutedSubTab>;
  addressHash?: string;
}

const { wagmiClient, ethereumClient } = (() => {
  try {
    const currentChain: Chain = {
      id: Number(appConfig.network.id),
      name: appConfig.network.name || '',
      network: appConfig.network.name || '',
      nativeCurrency: {
        decimals: appConfig.network.currency.decimals,
        name: appConfig.network.currency.name || '',
        symbol: appConfig.network.currency.symbol || '',
      },
      rpcUrls: {
        'default': {
          http: [ appConfig.network.rpcUrl || '' ],
        },
      },
      blockExplorers: {
        'default': {
          name: 'Blockscout',
          url: appConfig.baseUrl,
        },
      },
    };

    const chains = [ currentChain ];

    const { provider } = configureChains(chains, [
      walletConnectProvider({ projectId: appConfig.walletConnect.projectId || '' }),
    ]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: modalConnectors({ appName: 'web3Modal', chains }),
      provider,
    });
    const ethereumClient = new EthereumClient(wagmiClient, chains);

    return { wagmiClient, ethereumClient };
  } catch (error) {
    return { wagmiClient: undefined, ethereumClient: undefined };
  }
})();

const TAB_LIST_PROPS = {
  columnGap: 3,
};

const AddressContract = ({ addressHash, tabs }: Props) => {
  const modalZIndex = useToken<string>('zIndices', 'modal');
  const web3ModalTheme = useColorModeValue('light', 'dark');

  const noProviderTabs = React.useMemo(() => tabs.filter(({ id }) => id === 'contact_code'), [ tabs ]);
  if (!wagmiClient || !ethereumClient) {
    return <RoutedTabs tabs={ noProviderTabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>;
  }

  return (
    <WagmiConfig client={ wagmiClient }>
      <ContractContextProvider addressHash={ addressHash }>
        <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>
      </ContractContextProvider>
      <Web3Modal
        projectId={ appConfig.walletConnect.projectId }
        ethereumClient={ ethereumClient }
        themeZIndex={ Number(modalZIndex) }
        themeMode={ web3ModalTheme }
        themeBackground="themeColor"
      />
    </WagmiConfig>
  );
};

export default React.memo(AddressContract);
