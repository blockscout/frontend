import { PopoverContent, PopoverBody, Text, Tabs, TabList, TabPanels, TabPanel, Tab, VStack } from '@chakra-ui/react';
import React from 'react';

import type { NetworkLink } from './types';

import gnosisIcon from 'icons/networks/gnosis.svg';

import NetworkMenuLink from './NetworkMenuLink';

type PopupTab = 'mainnets' | 'testnets' | 'other';

const TABS: Array<PopupTab> = [ 'mainnets', 'testnets', 'other' ];

const LINKS: Record<PopupTab, Array<NetworkLink>> = {
  mainnets: [
    { name: 'Gnosis Chain', url: '/xdai/mainnet', icon: gnosisIcon },
    { name: 'Optimism on Gnosis Chain', url: '/xdai/optimism', icon: gnosisIcon },
    { name: 'Arbitrum on xDai', url: '/xdai/aox', icon: gnosisIcon },
    { name: 'Ethereum', url: '/eth/mainnet', icon: gnosisIcon },
    { name: 'Ethereum Classic', url: '/etc/mainnet', icon: gnosisIcon },
    { name: 'POA', url: '/poa/core', icon: gnosisIcon },
    { name: 'RSK', url: '/rsk/mainnet', icon: gnosisIcon },
  ],
  testnets: [
    { name: 'Gnosis Chain Testnet', url: '/xdai/testnet', icon: gnosisIcon },
    { name: 'POA Sokol', url: '/poa/sokol', icon: gnosisIcon },
  ],
  other: [
    { name: 'ARTIS Σ1', url: '/artis/sigma1', icon: gnosisIcon },
    { name: 'LUKSO L14', url: '/lukso/l14', icon: gnosisIcon },
  ],
};

const NetworkMenuPopup = () => {
  return (
    <PopoverContent w="382px">
      <PopoverBody>
        <Text as="h4" fontSize="18px" lineHeight="30px" fontWeight="500">Networks</Text>
        <Tabs variant="soft-rounded" mt={ 4 } isLazy>
          <TabList>
            { TABS.map((tab) => <Tab key={ tab } textTransform="capitalize">{ tab }</Tab>) }
          </TabList>
          <TabPanels>
            { TABS.map((tab) => (
              <TabPanel key={ tab } p={ 0 }>
                <VStack as="ul" spacing={ 2 } alignItems="stretch" mt={ 4 }>
                  { LINKS[tab].map((link) => <NetworkMenuLink key={ link.name } { ...link }/>) }
                </VStack>
              </TabPanel>
            )) }
          </TabPanels>
        </Tabs>
      </PopoverBody>
    </PopoverContent>
  );
};

export default NetworkMenuPopup;
