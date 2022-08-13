import { PopoverContent, PopoverBody, Text, Tabs, TabList, TabPanels, TabPanel, Tab, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { NetworkLink } from './types';

import arbitrumIcon from 'icons/networks/arbitrum.svg';
import artisIcon from 'icons/networks/artis.svg';
import ethereumClassicIcon from 'icons/networks/ethereum-classic.svg';
import ethereumIcon from 'icons/networks/ethereum.svg';
import gnosisIcon from 'icons/networks/gnosis.svg';
import poaSokolIcon from 'icons/networks/poa-sokol.svg';
import poaIcon from 'icons/networks/poa.svg';
import rskIcon from 'icons/networks/rsk.svg';

import NetworkMenuLink from './NetworkMenuLink';

type PopupTab = 'mainnets' | 'testnets' | 'other';

const TABS: Array<PopupTab> = [ 'mainnets', 'testnets', 'other' ];

const NetworkMenuPopup = () => {
  const gnosisChainIconColor = useColorModeValue('black', 'white');
  const poaChainIconColor = useColorModeValue('gray.100', 'gray.100');

  const LINKS: Record<PopupTab, Array<NetworkLink>> = {
    mainnets: [
      { name: 'Gnosis Chain', url: '/xdai/mainnet', icon: gnosisIcon, iconColor: gnosisChainIconColor },
      { name: 'Optimism on Gnosis Chain', url: '/xdai/optimism', icon: gnosisIcon, iconColor: gnosisChainIconColor },
      { name: 'Arbitrum on xDai', url: '/xdai/aox', icon: arbitrumIcon },
      { name: 'Ethereum', url: '/eth/mainnet', icon: ethereumIcon },
      { name: 'Ethereum Classic', url: '/etc/mainnet', icon: ethereumClassicIcon },
      { name: 'POA', url: '/poa/core', icon: poaIcon, iconColor: poaChainIconColor },
      { name: 'RSK', url: '/rsk/mainnet', icon: rskIcon },
    ],
    testnets: [
      { name: 'Gnosis Chain Testnet', url: '/xdai/testnet', icon: arbitrumIcon },
      { name: 'POA Sokol', url: '/poa/sokol', icon: poaSokolIcon },
    ],
    other: [
      { name: 'ARTIS Σ1', url: '/artis/sigma1', icon: artisIcon },
      { name: 'LUKSO L14', url: '/lukso/l14', icon: poaIcon, iconColor: poaChainIconColor },
    ],
  };

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
