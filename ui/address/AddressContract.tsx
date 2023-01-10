import { useColorModeValue } from '@chakra-ui/react';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import React from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createClient, WagmiConfig } from 'wagmi';

import type { RoutedSubTab } from 'ui/shared/RoutedTabs/types';

import { ContractContextProvider } from 'ui/address/contract/context';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

interface Props {
  tabs: Array<RoutedSubTab>;
}

const TAB_LIST_PROPS = {
  columnGap: 3,
};

export const poa: Chain = {
  id: 99,
  name: 'POA',
  network: 'poa',
  nativeCurrency: {
    decimals: 18,
    name: 'POA',
    symbol: 'POA',
  },
  rpcUrls: {
    'default': { http: [ 'https://core.poa.network' ] },
  },
  blockExplorers: {
    'default': { name: 'Blockscout', url: 'https://blockscout.com/poa/core' },
  },
};

const chains = [ poa ];

const PROJECT_ID = 'b4ed81be141093911032944632465175';
// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: PROJECT_ID }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const AddressContract = ({ tabs }: Props) => {
  return (
    <WagmiConfig client={ wagmiClient }>
      <ContractContextProvider>
        <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>
      </ContractContextProvider>
      <Web3Modal
        projectId={ PROJECT_ID }
        ethereumClient={ ethereumClient }
        themeZIndex={ 1200 }
        themeMode={ useColorModeValue('light', 'dark') }
        themeBackground="themeColor"
      />
    </WagmiConfig>
  );
};

export default React.memo(AddressContract);
